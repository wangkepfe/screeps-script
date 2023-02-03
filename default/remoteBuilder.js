var utils = require('utils');
module.exports =
{
    run: function(creep)
    {
        if (creep.memory.state == 0) // go there
        {
            creep.say('RB' + creep.memory.targetID + ':0');

            var sourcePos = new RoomPosition(25, 25, creep.memory.targetRoom);

            creep.moveTo(sourcePos, {visualizePathStyle: {stroke: '#ffffff'}});

            if (creep.pos.roomName == creep.memory.targetRoom)
            {
                creep.memory.state = 1;
            }
        }
        else if (creep.memory.state == 1) // mine
        {
            creep.say('RB' + creep.memory.targetID + ':1');

            var source = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (src) => { return src.energy > 0; }});

            var mineCode = creep.harvest(source);
            if (mineCode == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            if (creep.store.getFreeCapacity() == 0 || mineCode == ERR_NOT_ENOUGH_RESOURCES) // full
            {
                creep.memory.state = 2;
            }
        }
        else if (creep.memory.state == 2) // build
        {
            creep.say('RB' + creep.memory.targetID + ':2');

            var nearestSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);

            if (nearestSite)
            {
                if (creep.build(nearestSite) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(nearestSite, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                creep.say('💤');
            }

            if (creep.store.getFreeCapacity() == creep.store.getCapacity()) // empty
            {
                creep.memory.state = 1;
            }
        }
    },

    create: function(room, spawn, remoteRooms, remoteBuilders)
    {
        let mybody = [WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            let roomTargetID = -1;
            for (let i = 0; i < remoteRooms.length; ++i)
            {
                let occupied = false;

                for (let remoteBuilderId in remoteBuilders)
                {
                    let remoteBuilder = remoteBuilders[remoteBuilderId];
                    if (remoteBuilder.memory.targetID == i)
                    {
                        occupied = true;
                    }
                }

                if (!occupied)
                {
                    let rRoom = Game.rooms[remoteRooms[i]];
                    if (rRoom)
                    {
                        let rSites = rRoom.find(FIND_MY_CONSTRUCTION_SITES);
                        if (rSites.length > 0)
                        {
                            roomTargetID = i;
                            break;
                        }
                    }
                }
            }

            if (roomTargetID >= 0)
            {
                spawn.spawnCreep(mybody, 'remoteBuilder' + spawn.memory.creepID,
                {
                    memory:
                    {
                        role: "remoteBuilder",
                        targetRoom: remoteRooms[roomTargetID],
                        targetID: roomTargetID,
                        state: 0,
                        ID: spawn.memory.creepID,
                        roomName: room.name
                    }
                });
                spawn.memory.creepID++;
            }
        }
    }
}