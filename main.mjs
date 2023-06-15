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
    id;
    constructor(creep , isgrouped ) {
        this.creep = creep;
        this.isgrouped = isgrouped;
    }
    
}

class Group {
    killers = new Array();
    healers = new Array();
    range_attackers = new Array();
    members = new Array();
    isbattling;

    constructor() {
        var count = 0;var cnt = 0;
        for(var c of creeps) {
            if(c.isgrouped == false && c.creep.body.some(b=>b.type == ATTACK)) {
                this.killers.push(c.creep);
                this.members.push(c);
                c.isgrouped = true;c.id = ++cnt;
                count++;
            }
            if(count >= 1) break;
        }
        var count = 0;
        for(var c of creeps) {
            if(c.isgrouped == false && c.creep.body.some(b=>b.type == HEAL)) {
                this.healers.push(c.creep);
                this.members.push(c);
                c.isgrouped = true;c.id = ++cnt;
                count++;
            }
            if(count >= 3) break;
        }
        var count = 0;
        for(var c of creeps) {
            if(c.isgrouped == false && c.creep.body.some(b=>b.type == RANGED_ATTACK)) {
                this.range_attackers.push(c.creep);
                this.members.push(c);
                c.isgrouped = true;c.id = ++cnt;
                count++;
            }
            if(count >= 3) break;
        }
    }

    testMembers() {
        for(var c of this.members) {
            console.log(c.body);
        }
    }
    
    moveTo(flag) {
        var temp;
        for(var c of this.members) {
            if(c.creep.body.some(b=>b.type == ATTACK)) {
                c.creep.moveTo(flag);
                temp = c;
            }
            else {
                c.creep.moveTo(temp.creep);
                temp = c;
            }
        }
    }


    battle() {
        
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



const towers = getObjectsByPrototype(StructureTower).filter(i=>i.my);
const flag = getObjectsByPrototype(Flag).find(i=>!i.my);
const home = getObjectsByPrototype(Flag).find(i=>i.my);
const creeps = GetCreeps();
var f = 0;


var group1 = new Group();
var group2 = new Group();

export function loop() {
    // Your code goes here

    group1.moveTo(flag);
    group2.moveTo(flag);
    
    
    for(var t of towers) {
        var target = getObjectsByPrototype(Creep).find(i=>!i.my);
        if(t.store[RESOURCE_ENERGY] > 30) t.attack(target);
    }
}








