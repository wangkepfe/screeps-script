var utils = require('utils');

var towerModule = require('tower');
var linkModule = require('link');

var minerModule = require('miner');
var linkMinerModule = require('linkMiner');
var haulerModule = require('hauler');
var passerModule = require('passer');
var upgraderModule = require('upgrader');
var distributorModule = require('distributor');
var remoteHarvesterModule = require('remoteHarvester');
var builderModule = require('builder');
var remoteBuilderModule = require('remoteBuilder');

module.exports.loop = function ()
{
    for (var name in Memory.creeps)
    {
        if (!Game.creeps[name])
        {
            delete Memory.creeps[name];
        }
    }

    var room = Game.rooms["E37S4"];
    var spawn = Game.spawns['Spawn1'];

    const remoteRooms = ['E38S4', 'E38S3']

    const remoteSources = [
        new RoomPosition(9, 31, 'E38S4'),
        new RoomPosition(10, 42, 'E38S4'),
        new RoomPosition(3, 26, 'E38S3'),
        new RoomPosition(27, 14, 'E38S3')
    ];

    spawn.memory.maxNumMiners = 1;
    spawn.memory.maxNumLinkMiners = 1;
    spawn.memory.maxNumHaulers = 1;
    spawn.memory.maxNumPassers = 1;
    spawn.memory.maxNumDistributors = 1;
    spawn.memory.maxNumUpgraders = 1;
    spawn.memory.maxNumRemoteHarvesters = 0;
    spawn.memory.maxNumRemoteBuilders = 0;

    var sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
    spawn.memory.maxNumBuilders = Math.max(Math.ceil(sites.length / 10), 2);

    var storages = spawn.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
    if (storages.length > 0)
    {
        spawn.room.visual.text(storages[0].store.getUsedCapacity().toString(), storages[0].pos.x - 1.5, storages[0].pos.y, {align: 'center', opacity: 0.5});

        if (storages[0].store.getUsedCapacity() > 100000)
        {
            spawn.memory.maxNumUpgraders = 2;
        }
    }

    spawn.room.visual.text(room.energyAvailable.toString() + '/' + room.energyCapacityAvailable.toString(), spawn.pos.x, spawn.pos.y + 1.2, {align: 'center', opacity: 0.5});

    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == "hauler" && creep.ticksToLive >= 50);
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == "miner" && creep.ticksToLive >= 50);
    var linkMiners = _.filter(Game.creeps, (creep) => creep.memory.role == "linkMiner" && creep.ticksToLive >= 50);
    var passers = _.filter(Game.creeps, (creep) => creep.memory.role == "passer" && creep.ticksToLive >= 50);
    var distributors = _.filter(Game.creeps, (creep) => creep.memory.role == "distributor" && creep.ticksToLive >= 50);

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader");
    var remoteHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == "remoteHarvester");
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == "builder");
    var remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == "remoteBuilder");

    // console.log(remoteHarvesters.length)
    // console.log(spawn.memory.maxNumRemoteHarvesters)

    if (distributors.length < spawn.memory.maxNumDistributors)
    {
        var mybody = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE];

        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'distributor' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "distributor",
                    state: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
        else
        {
            var mybody2 = [CARRY,CARRY, MOVE];
            spawn.spawnCreep(mybody2, 'distributor' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "tempDistributor",
                    state: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }
    else if (linkMiners.length < spawn.memory.maxNumLinkMiners)
    {
        var mybody = [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'linkMiner' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "linkMiner",
                    state: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }
    else if (miners.length < spawn.memory.maxNumMiners)
    {
        var mybody = [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'miner' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "miner",
                    state: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }
    else if (haulers.length < spawn.memory.maxNumHaulers)
    {
        var mybody = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'hauler' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "hauler",
                    state: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }
    else if (passers.length < spawn.memory.maxNumPassers)
    {
        var mybody = [CARRY,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'passer' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "passer",
                    state: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }
    else if (upgraders.length < spawn.memory.maxNumUpgraders)
    {
        var mybody = [WORK,WORK,WORK,WORK,WORK, WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'upgrader' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "upgrader",
                    state: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }
    else if (builders.length < spawn.memory.maxNumBuilders)
    {
        var mybody = [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE];

        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            spawn.spawnCreep(mybody, 'builder' + spawn.memory.creepID,
            {
                memory:
                {
                    role: "builder",
                    state: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }
    else if (remoteHarvesters.length < spawn.memory.maxNumRemoteHarvesters)
    {
        var mybody = [WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
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
                    storage: storages[0].pos,
                    target: remoteSources[sourceTargetID],
                    state: 0,
                    targetID: sourceTargetID,
                    startTime: Game.time,
                    tripRoundTime: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }
    else if(0)
    {
        var mybody = [WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE, MOVE,MOVE];
        if (utils.bodyCost(mybody) <= room.energyAvailable)
        {
            var roomTargetID = 0;

            for (let i = 0; i < remoteRooms.length; ++i)
            {
                let occupied = false;

                for (var remoteHarvesterId in remoteBuilders)
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
                    storage: storages[0].pos,
                    target: remoteSources[sourceTargetID],
                    state: 0,
                    targetID: sourceTargetID,
                    startTime: Game.time,
                    tripRoundTime: 0,
                    ID: spawn.memory.creepID
                }
            });
            spawn.memory.creepID++;
        }
    }

    for (var name in Game.creeps)
    {
        var creep = Game.creeps[name];

        if (creep.memory.role == "hauler")
        {
            haulerModule.run(creep);
        }
        else if (creep.memory.role == "miner")
        {
            minerModule.run(creep);
        }
        else if (creep.memory.role == "linkMiner")
        {
            linkMinerModule.run(creep);
        }
        else if (creep.memory.role == "passer")
        {
            passerModule.run(creep);
        }
        else if (creep.memory.role == "upgrader")
        {
            upgraderModule.run(creep);
        }
        else if (creep.memory.role == "distributor" || creep.memory.role == "tempDistributor")
        {
            distributorModule.run(creep);
        }
        else if (creep.memory.role == "remoteHarvester")
        {
            remoteHarvesterModule.run(creep);
        }
        else if (creep.memory.role == "builder")
        {
            builderModule.run(creep);
        }
        else if (creep.memory.role == "remoteBuilder")
        {
            remoteBuilderModule.run(creep);
        }

        var drops = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (drops.length > 0)
        {
            creep.pickup(drops[0]);
        }

        var tombstones = creep.pos.findInRange(FIND_TOMBSTONES, 1);
        if (tombstones.length > 0)
        {
            creep.withdraw(tombstones[0], RESOURCE_ENERGY);
        }
    }

    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    for (var towerID in towers)
    {
        var tower = towers[towerID];
        towerModule.run(tower);
    }

    var links = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
    for (var linkID in links)
    {
        var link = links[linkID];
        linkModule.run(link);
    }

    if (0)
    {
        var statsConsole = require("statsConsole");
        let myStats = [
            // ["Creep Managers", CreepManagersCPUUsage],
        ];

        statsConsole.run(myStats);
        if ((Game.time % 5) === 0) {
            console.log(statsConsole.displayHistogram());
            console.log(statsConsole.displayStats());
            console.log(statsConsole.displayLogs());
        }
    }
}

