import { getObjectsByPrototype } from 'game/utils';
import { Creep, StructureTower } from 'game/prototypes';
import { ATTACK, ERR_NOT_IN_RANGE, HEAL, RANGED_ATTACK, RESOURCE_ENERGY } from 'game/constants';
// @ts-ignore
import { } from 'arena';
import { Flag } from 'arena/season_alpha/capture_the_flag/basic';

import {} from 'game';

class myCreep {
    creep ;
    isgrouped ;
    constructor(creep , isgrouped ) {
        this.creep = creep;
        this.isgrouped = isgrouped;
    }
    
}

class group {
    killers = new Array();
    healers = new Array();
    range_attackers = new Array();
    constructor() {
        var count = 0;
        for(var c of creeps) {
            if(c.isgrouped == false && c.creep.body.some(b=>b.type == ATTACK)) {
                this.killers.push(c);
                c.isgrouped = true;
            }
            if(count >= 1) break;
        }
        var count = 0;
        for(var c of creeps) {
            if(c.isgrouped == false && c.creep.body.some(b=>b.type == HEAL)) {
                this.healers.push(c);
                c.isgrouped = true;
            }
            if(count >= 3) break;
        }
        var count = 0;
        for(var c of creeps) {
            if(c.isgrouped == false && c.creep.body.some(b=>b.type == RANGED_ATTACK)) {
                this.range_attackers.push(c);
                c.isgrouped = true;
            }
            if(count >= 3) break;
        }
    }
    
    moveTo(flag) {
        
    }
}



function GetCreeps() {
    var creeps = new Array();
    var cs = getObjectsByPrototype(Creep).filter(i=>i.my);
    for(var c of cs) {
        var newCreep = new myCreep(c,false);
        creeps.push(newCreep);
    }
    return creeps;
}

function make_group(creeps) {
    var soilders
    for(var c of creeps) {

    }
}



const towers = getObjectsByPrototype(StructureTower).filter(i=>i.my);
const flag = getObjectsByPrototype(Flag).find(i=>!i.my);
const home = getObjectsByPrototype(Flag).find(i=>i.my);
const creeps = GetCreeps();
var f = 0;




export function loop() {
    // Your code goes here

    var soliders = getObjectsByPrototype(Creep).filter(i=>i.my && (i.body.some(b=>b.type==ATTACK)));
    var guards = getObjectsByPrototype(Creep).filter(i=>i.my && (i.body.some(b=>b.type == RANGED_ATTACK)));
    var healers = getObjectsByPrototype(Creep).filter(i=>i.my && (i.body.some(b=>b.type==HEAL)));

    for(var c of soliders) {
        var es = getObjectsByPrototype(Creep).find(i=>!i.my);
        if(c.attack(es) == ERR_NOT_IN_RANGE) {
            c.moveTo(es);
        }
    }

    var leader;
    for(var c of healers) {
        if(c == healers[0]) {
            leader = c;
            c.moveTo(flag);
        }
        else {
            if(leader.hits < leader.hitsMax) {
                if(c.heal(leader) == ERR_NOT_IN_RANGE) {
                    
                    c.moveTo(leader);
                }
            }
            else {
                c.moveTo(leader);
            }
        }
    }

    for(var c of guards) {
        var es = getObjectsByPrototype(Creep).find(i=>!i.my);
        if(!f && c.getRangeTo(home) != 0)c.moveTo(home);
        else {
            f = 1;
            c.rangedAttack(es);
        }
    }


    for(var t of towers) {
        var target = getObjectsByPrototype(Creep).find(i=>!i.my);
        if(t.store[RESOURCE_ENERGY] > 30) t.attack(target);
    }
}








