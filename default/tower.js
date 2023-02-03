var utils = require('utils');
module.exports = {
    run: function(tower)
    {
        var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0)
        {
            var healers = [];

            for (let id in hostiles)
            {
                var enemy = hostiles[id];

                for (let body in enemy.body)
                {
                    if (body.type == HEAL)
                    {
                        healers.concat(enemy);
                        break;
                    }
                }
            }

            if (healers.length > 0)
            {
                tower.attack(healers[0]);
            }
            else
            {
                tower.attack(hostiles[0]);
            }
        }
        else
        {
            var creepsNeedHeal = tower.room.find(FIND_MY_CREEPS,
            {
                filter: (creep) =>
                {
                    return creep.hits < creep.hitsMax;
                }
            });

            if (creepsNeedHeal.length > 0)
            {
                tower.heal(creepsNeedHeal[0]);
            }
            else
            {
                var roadsNeedRepair = tower.room.find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) && structure.hits < structure.hitsMax;
                        }
                    });

                if (roadsNeedRepair.length > 0)
                {
                    tower.repair(roadsNeedRepair[0]);
                }
                else
                {
                    var ramparts = tower.room.find(FIND_STRUCTURES,
                    {
                        filter: (structure) =>
                        {
                            return structure.structureType == STRUCTURE_RAMPART && structure.hits < 500000;
                        }
                    });

                    if (ramparts.length > 0)
                    {
                        tower.repair(ramparts[0]);
                    }
                }
            }
        }

        tower.room.visual.text(tower.store[RESOURCE_ENERGY].toString() + '/' + tower.store.getCapacity(RESOURCE_ENERGY).toString(), tower.pos.x, tower.pos.y + 1.2, {align: 'center', opacity: 0.5});
    }
};