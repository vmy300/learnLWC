import { LightningElement,track,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import {registerListener,unregisterListener}  from 'c/pubsub';
import getCurrentTodos  from '@salesforce/apex/ToDoController.getCurrentTodos';

export default class TodoTable extends LightningElement {

 @track data=[];

 @wire(CurrentPageReference)pageRef;

 //For lightning-data
//   @track columns = [
//    {
//     label: 'ToDo Id',
//     type: 'text',
//     fieldName:'Id',
//    },
//    {
//    label: 'ToDo Name',
//    type: 'text',
//    fieldName:'Name',
//  },
//  {
//    label: 'Done',
//    fieldName: 'Done__c',
//    type: 'boolean'
//  }];

connectedCallback(){
this.getUpdatedToDos();
 registerListener('addPubsub',this.getUpdatedToDos,this);
 registerListener('updatePubsub',this.getUpdatedToDos,this);
 registerListener('deletePubsub',this.getUpdatedToDos,this);
}
 
getUpdatedToDos(){
  getCurrentTodos().then(data=>{
    this.data=data;
    console.log('Got data using pubsub');
  }).catch(err=>{
console.log(err);
  });
}

// Getting error here saying @chachable should be true can I know the reason why
//  @wire(getCurrentTodos)
//  result({ data, error }) {
//   if (data) {
//    this.data=data;
//     console.log('Data from wire '+data);
//   } else if (error) {
//     console.error(error);
//   }
// }

disconnectedCallback(){
  unregisterListener(this);
}
}