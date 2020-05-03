/**
 * ToDoItem component
 * Provides ability to edit/remove the item
 * @author Manish Choudhari
 */
import { LightningElement, api, wire } from "lwc";
import updateTodo from "@salesforce/apex/ToDoController.updateTodo";
import deleteTodo from "@salesforce/apex/ToDoController.deleteTodo";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";

export default class ToDoItem extends LightningElement {
  //public properties
  @api todoName;
  @api todoId;
  @api done = false;

  @wire(CurrentPageReference)pageRef;

  /**
   * Update handler to edit current item
   * You can switch the item status between completed and uncompleted
   * Make a call to server to update the item
   */
  updateHandler() {
    //create todo object based to the current item
    const todo = {
      todoId: this.todoId,
      done: !this.done,
      todoName: this.todoName
    };

    //make a call to server to update the item
    updateTodo({ payload: JSON.stringify(todo) })
      .then(result => {
        //on successful update, fire an event to notify parent component
        // const updateEvent = new CustomEvent("update", { detail: todo });
        // this.dispatchEvent(updateEvent);

        //we can pass data using pubsub using eventParam variable as follows
        var eventParam={payload:this.todo};
        //firing deleteEvent using pubcub
        fireEvent(this.pageRef,'updatePubsub',eventParam);
      })
      .catch(error => {
        console.error("Error in updatig records ", error);
      });
  }

  /**
   * Delete handler to delete current item
   * Make a call to server to delete the item
   */
  deleteHandler() {
    //make a call to server to delete item
    deleteTodo({ todoId: this.todoId })
      .then(result => {
        //on successful delete, fire an event to notify parent component
        // this.dispatchEvent(new CustomEvent("delete", { detail: this.todoId }));

        //we can pass data using pubsub using eventParam variable as follows
        var eventParam={payload:this.todoId};
        //firing deleteEvent using pubcub
        fireEvent(this.pageRef,'deletePubsub',eventParam);
      })
      .catch(error => {
        console.error("Error in updatig records ", error);
      });
  }

  // get property to return icon name based on item state
  // for completed item, return check icon, else return add icon
  get buttonIcon() {
    return this.done ? "utility:check" : "utility:add";
  }

  // get property to return container class
  get containerClass() {
    return this.done ? "todo completed" : "todo upcoming";
  }
}
