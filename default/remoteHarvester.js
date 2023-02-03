var utils = require('utils');
module.exports =
{
    run: function(creep)
    {
        // creep.memory.targetID = 0;
        // if (creep.memory.ID == 3492)
        // {
        //     creep.memory.target = new RoomPosition(10, 42, 'E38S4');
        //     creep.memory.storage = new RoomPosition(18, 20, 'E37S4');
        // }

        // if (creep.memory.ID == 3562)
        // {
        //     creep.memory.target = new RoomPosition(9, 31, 'E38S4');
        //     creep.memory.storage = new RoomPosition(18, 20, 'E37S4');
        // }

        // creep.memory.tripRoundTime = 0;

        // var objectsOnSameTile = creep.room.lookAt(creep);
        // var roadOnSameTile = _.filter(objectsOnSameTile, (obj) => (obj.type == LOOK_STRUCTURES && obj.structure.structureType == STRUCTURE_ROAD));

        // if (roadOnSameTile.length == 0)
        // {
        //     var roadConstructionOnSameTile = _.filter(objectsOnSameTile, (obj) => (obj.type == LOOK_CONSTRUCTION_SITES));

        //     if (roadConstructionOnSameTile.length == 0)
        //     {
        //         creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        //     }
        // }

        var nearRoadsNeedRepair = creep.pos.findInRange(FIND_STRUCTURES, 2,
        {
            filter: (structure) =>
            {
                return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax;
            }
        });
        // console.log('R' + creep.memory.targetID + " nearRoadsNeedRepair " + nearRoadsNeedRepair.length);
        if (nearRoadsNeedRepair.length > 0)
        {
            // console.log("repairing");
            creep.repair(nearRoadsNeedRepair[0]);
        }

        if (creep.memory.state == 0) // go there
        {
            creep.say('R' + creep.memory.targetID + ':0');

            var sourcePos = new RoomPosition(creep.memory.target.x, creep.memory.target.y, creep.memory.target.roomName);

            creep.moveTo(sourcePos, {visualizePathStyle: {stroke: '#ffffff'}});

            if (creep.pos.inRangeTo(sourcePos, 1))
            {
                creep.memory.state = 1;
            }
        }
        else if (creep.memory.state == 1) // mine
        {
            creep.say('R' + creep.memory.targetID + ':1');

            creep.harvest(creep.pos.findClosestByRange(FIND_SOURCES));

            if (creep.store.getFreeCapacity() == 0)
            {
                creep.memory.state = 2;
            }
        }
        else if (creep.memory.state == 2) // go back
        {
            creep.say('R' + creep.memory.targetID + ':2');

            var storagePos = new RoomPosition(creep.memory.storage.x, creep.memory.storage.y, creep.memory.storage.roomName);
            creep.moveTo(storagePos, {visualizePathStyle: {stroke: '#ffffff'}});

            if (creep.pos.inRangeTo(storagePos, 1))
            {
                creep.memory.state = 3;
            }

            if (creep.store.getFreeCapacity() > 100)
            {
                creep.memory.state = 0;
            }
        }
        else if (creep.memory.state == 3) // refill
        {
            creep.say('R' + creep.memory.targetID + ':3');

            creep.transfer(creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}})[0], RESOURCE_ENERGY);

            if (creep.store.getUsedCapacity() == 0)
            {
                creep.memory.state = 0;
                creep.memory.tripRoundTime = Game.time - creep.memory.startTime;
                console.log('remote harvester ' + creep.memory.targetID + ': trip round time = ' + creep.memory.tripRoundTime + '. net energy gain per tick = ' + (500.0 / creep.memory.tripRoundTime - 1500.0 / 1500.0));
                creep.memory.startTime = Game.time;

                if (creep.ticksToLive < creep.memory.tripRoundTime - 10)
                {
                    creep.memory.state = 4;
                }
            }
        }
        else if (creep.memory.state == 4) // recycle
        {
            creep.say('R' + creep.memory.targetID + ':4');
            var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
            if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(spawn);
            }
        }
    },

    create: function(room, spawn, remoteSources, remoteHarvesters, storage)
    {
        var mybody = [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            var sourceTargetID = 0;

            for (let i = 0; i < remoteSources.length; ++i)
            {
                let occupied = false;

                for (var remoteHarvesterId in remoteHarvesters)
                {
                    var remoteHarvester = remoteHarvesters[remoteHarvesterId];
                    if (remoteHarvester.memory.targetID == i)
                    {
                        occupied = true;
                    }
                }

                if (!occupied)
                {
                    sourceTargetID = i;
                }
            }

            spawn.spawnCreep(mybody, 'remoteHarvester' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "remoteHarvester",
                    storage: storage.pos,
                    target: remoteSources[sourceTargetID],
                    state: 0,
                    targetID: sourceTargetID,
                    startTime: Game.time,
                    tripRoundTime: 0,
                    ID: spawn.memory.creepID,
                    roomName: room.name
                }
            });
            spawn.memory.creepID++;
        }
    }

}