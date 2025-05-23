import React from 'react';
import { getRandomInt } from './Utils';

//string return type is a hack fix to easily send JSON objects back and forth
//local storage is just to demonstrate functionality. in reality, this would use a server backend

//----------------GROUP ACTION FUNCTIONS-------------------
export function NewGroup(groupname:string, description:string, user:string): string { 
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');

  //generate an ID for the new group
  let newid = getRandomInt(0,99999999999);
  while(newid.toString() in groupobject){
    newid = getRandomInt(0,99999999999); //eliminate the chance of two identical group IDs
  }
  groupobject[`${newid}`] = {"name" : `${groupname}`, "description" : `${description}`, "members" : {}};
  groupobject[`${newid}`]["members"][`${user}`] = {"role" : Role.OWNER};
  localStorage.setItem("groups", JSON.stringify(groupobject));
  AutoPopulateGroup(`${newid}`,user);
  return newid.toString();
}

function AutoPopulateGroup(groupid: string, user:string){ //for presentation purposes only
  AddUserToGroup(groupid, "oski.bear@berkeley.edu", user);
  AddUserToGroup(groupid, "burnt_tree@jrcollege.edu", user); //stanford roast, dont take it seriously
}

//only the owner can delete a group
export function DeleteGroup(groupid:string, adminuser:string) : boolean{
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject){
    if(IsOwner(groupid,adminuser)){
      let deletegroup = confirm("Are you sure you want to delete this group?");
      if(deletegroup){
        delete groupobject[groupid];
        localStorage.setItem("groups", JSON.stringify(groupobject));
        return true;
      }
    }
  }
  return false;
}

export function AddUserToGroup(groupid:string, user:string, adminuser:string) : boolean{
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject  && HasAdminPerms(groupid,adminuser) && !IsInGroup(groupid,user)){
    let groupmembers = groupobject[groupid]['members'];
    groupmembers[`${user}`] = {"role" : Role.MEMBER};
    localStorage.setItem("groups", JSON.stringify(groupobject));
    return true;
  }
  return false;
}

export function RemoveUserFromGroup(groupid:string, user:string, adminuser:string) : boolean{
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject){
    
  }
  return false;
}

//returns true if the user successfully left the group
export function LeaveGroup(groupid:string, user:string) : boolean{
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if((groupid in groupobject) && IsInGroup(groupid,user)){
    if(IsOwner(groupid,user)){
      alert("You must transfer ownership before leaving this group!");
    }
    else{
      let leavegroup = confirm("Are you sure you want to leave this group?");
      if(leavegroup){
        let group = groupobject[groupid];
        let groupmembers = group['members'];
        delete groupmembers[user];
        localStorage.setItem("groups", JSON.stringify(groupobject));
        return true;
      }
    }
  }
  return false
}

//oldowner must have the "owner" role, newowner must have an "admin" role
export function TransferOwnership(groupid:string, oldowner:string, newowner:string) : boolean{
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject && IsOwner(groupid,oldowner) && IsAdmin(groupid,newowner)){
    let group = groupobject[groupid];
    let groupmembers = group['members'];
    groupmembers[oldowner]['role'] = Role.ADMIN;
    groupmembers[newowner]['role'] = Role.OWNER;
    localStorage.setItem("groups", JSON.stringify(groupobject));
    return true;
  }
  return false;
}

export function PromoteToAdmin(groupid:string, user:string, owner:string) : boolean{
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject && IsOwner(groupid,owner) && IsInGroup(groupid,user)){
    let group = groupobject[groupid];
    let groupmembers = group['members'];
    groupmembers[user]['role'] = Role.ADMIN;
    localStorage.setItem("groups", JSON.stringify(groupobject));
    return true;
  }
  return false;
}

export function DemoteToMember(groupid:string, user:string, owner:string) : boolean{
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject && IsOwner(groupid,owner) && IsAdmin(groupid,user)){
    let group = groupobject[groupid];
    let groupmembers = group['members'];
    groupmembers[user]['role'] = Role.MEMBER;
    localStorage.setItem("groups", JSON.stringify(groupobject));
    return true;
  }
  return false;
}

//----------------GROUP UTILITY FUNCTIONS-------------------
export function GetGroup(groupid:string): string {
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  return groupid in groupobject ? `{ "${groupid}" : ${JSON.stringify(groupobject[groupid])}}` : '{}';
}

//returns an array of group IDs for which the user is a member of
export function GetAllGroupIDsFromUser(user:string): string[] {
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  let groupsToReturn: string[] = [];
  let groupids = Object.keys(groupobject);
  for (let i = 0; i < groupids.length; i++){
    let groupid = groupids[i];
    if(IsInGroup(groupid,user)){
      groupsToReturn.push(groupid);
    }
  }
  return groupsToReturn;
}

export function GetAllMembersInGroup(groupid:string) : string[]{
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  return groupid in groupobject ? Object.keys(groupobject[groupid]["members"]) : [];
}

export function IsInGroup(groupid:string, user:string) : boolean {
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject){
    return user in groupobject[groupid]['members'];
  }
  return false;
}

//check if the user has admin permissions (owner or admin)
export function IsAdmin(groupid:string, user:string) : boolean {
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject){
    let groupmembers = groupobject[groupid]['members'];
    if(user in groupmembers){
      return groupmembers[user]['role'] === Role.ADMIN;
    }
  }
  return false;
}

//check if a user is the owner of the group
export function IsOwner(groupid:string, user:string) : boolean {
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject){
    let groupmembers = groupobject[groupid]['members'];
    if(user in groupmembers){
      return groupmembers[user]['role'] === Role.OWNER;
    }
  }
  return false;
}

export function HasAdminPerms(groupid:string, user:string) : boolean {
  return IsOwner(groupid,user) || IsAdmin(groupid,user);
}

export function GetUserRole(groupid:string,user:string) : string {
  let groupobject = JSON.parse(localStorage.getItem("groups") || '{}');
  if(groupid in groupobject){
    let groupmembers = groupobject[groupid]['members'];
    if(user in groupmembers){
      return groupmembers[user]['role'];
    }
  }
  return "";
}

export enum Role{
  MEMBER = "member",
  ADMIN = "admin",
  OWNER = "owner"
}

export function RoleStringToEnum(value: string): Role | undefined {
  return Role[value as keyof typeof Role];
}

// compares two roles and returns 1, 0, or -1
// 1 = role1 has higher perms than role2, 0 = equal perms, -1 = lower perms
export function ComparePerms(role1:Role,role2:Role): number {
  switch(role1){
    case Role.OWNER:
      return role2 === Role.OWNER ? 0 : 1;
    case Role.ADMIN:
      if(role2 === Role.OWNER){
        return -1;
      }
      else{
        return role2 === Role.ADMIN ? 0 : 1;
      }
    default:
      return role2 === Role.MEMBER ? 0 : -1;
  }
}

/*
group format:
{
    id : 
    {
        "name" : string
        "description" : string
        "members" : 
            {
                "user":
                    {
                    "role" : Role
                    }
            }
        }
    }    
}

permissions:
member: TBD
Admin: can add or remove members from the group
Owner: admin permissions, can promote members to admin or demote admins to member, can delete group or transfer ownership to an admin
*/