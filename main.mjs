import { getObjectsByPrototype, getRange } from 'game/utils';
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
            if(c && c.isgrouped == false && c.creep.body.some(b=>b.type == ATTACK)) {
                this.killers.push(c.creep);
                this.members.push(c);
                c.isgrouped = true;c.id = ++cnt;
                count++;
            }
            if(count >= 1) break;
        }
        var count = 0;
        for(var c of creeps) {
            if(c && c.isgrouped == false && c.creep.body.some(b=>b.type == HEAL)) {
                this.healers.push(c.creep);
                this.members.push(c);
                c.isgrouped = true;c.id = ++cnt;
                count++;
            }
            if(count >= 3) break;
        }
        var count = 0;
        for(var c of creeps) {
            if(c && c.isgrouped == false && c.creep.body.some(b=>b.type == RANGED_ATTACK)) {
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
            if(c!=null && c.creep.body.some(b=>b.type == ATTACK)) {
                c.creep.moveTo(flag);
                temp = c;
            }
            else {
                c.creep.moveTo(temp.creep);
                temp = c;
            }
        }
    }


    battle(target) {
        var ready = false;
        for(var c of this.healers) {
            for(var cc of this.members) {
                if(cc.creep.hits < cc.creep.hitsMax) {
                    c.rangedHeal(cc);
                }
            }
            if(c.heal(this.killers[0]) == ERR_NOT_IN_RANGE) {
                c.moveTo(this.killers[0]);
                ready = false;
            }
            else ready = true;
        }
        for(var c of this.killers) {
            if(c && ready && c.attack(target) == ERR_NOT_IN_RANGE) {
                c.moveTo(target);
            }
        }
        for(var c of this.range_attackers) {
            if(c.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                c.moveTo(this.killers[0]);
            }
        }
    }

    enemy_discovered() {
        var enemies = getObjectsByPrototype(Creep).filter(i=>!i.my);
        var minn = 0xffff;
        var res;
        for(var e of enemies) {
            var temp = getRange(this.killers[0],e);
            if(temp < minn) {
                minn = temp;
                res = e;
            }
        }
        if(minn <= 20) return res;
    }

    attack_mode() {
        var target;
        if(target = this.enemy_discovered()){
            this.battle(target);
        }
        else this.moveTo(flag);

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
    if(group1)group1.attack_mode();
    if(group2)group2.attack_mode();
    
    
    for(var t of towers) {
        var target = getObjectsByPrototype(Creep).find(i=>!i.my);
        if(t.store[RESOURCE_ENERGY] > 30) t.attack(target);
    }
}








