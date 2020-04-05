// storage controller
const StorageCtrl=(function(){

    // public methods

    return {
        storeItem:function(item){
        let items;
        // check id any items in ls
        if(localStorage.getItem('items')===null){
            items=[];
            // push new item
            items.push(item);
            // set ls
            localStorage.setItem('items',JSON.stringify(items));

        }else{
            // get what is laready in ls

            items=JSON.parse(localStorage.getItem('items'));

            // push new item
            items.push(item);

            // reset ls
            localStorage.setItem('items',JSON.stringify(items));
        }
    },
    getItemsFromStorage:function(){
        let items=[];
        if(localStorage.getItem('items')===null){
            items=[];

        }else{
            items=JSON.parse(localStorage.getItem('items'));
        }
        return items;
    },
    updateItemStorage:function(updatedItem){
        let items=JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item,index){
            if(updatedItem.id===item.id){
                items.splice(index,1,updatedItem);

            }
        });
        localStorage.setItem('items',JSON.stringify(items));
    },
    deleteItemFromStorage:function(id){
        let items=JSON.parse(localStorage.getItem('items'));

        items.forEach(function(item,index){
            if(id===item.id){
                items.splice(index,1);

            }
        });
        localStorage.setItem('items',JSON.stringify(items));
 
    },
    clearItemsFromstorage:function(){
        localStorage.removeItem('items');
    }
}

})();

// item controller
const ItemCtrl=(function(){
    // item constructor
    const Item=function(id,name,calories){
        this.id=id;
        this.name=name;
        this.calories=calories;
    }
    // Data structure/state
    const data={
        // items:[

        //     // {id:0,name:'Steak Dinner',calories:1200},
        //     // {id:1,name:'Cookies',calories:400},
        //     // {id:2,name:'Eggs',calories:300}
        // ],
        items:StorageCtrl.getItemsFromStorage(),
        
        currentItem:null,
        totalCalories:0
    }
    // public methods
    return{
        getItems:function(){
            return data.items;
        },
        addItem:function(name,calories){
            let ID;
            // create id
            if(data.items.length>0){
              ID=data.items[data.items.length-1].id + 1;
            }else{
                ID=0;
            }
            //  calories to number
             calories=parseInt(calories);

            //  create new item
            newItem= new Item(ID,name,calories);
           
            // add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById:function(id){
         let found=null;

        //  loop through items
        data.items.forEach(function(item){
           if(item.id === id){
               found=item;
           }
        });
        return found;
        },
        // update item 
        updateItem:function(name,calories){
        //    calories to number
        calories=parseInt(calories);
         
        let found=null;
        
        data.items.forEach(function(item){
            if(item.id=== data.currentItem.id){
                item.name=name;
                item.calories=calories;
                found=item;
            }
        });

        return found;
        },
        deleteItem:function(id){
            // get ids
            const ids=data.items.map(function(item){
                return item.id
            });

            // get the index
            const index=ids.indexOf(id)

            // remove items
            data.items.splice(index,1)

        },
        clearAllItems:function(){
            data.items=[];
        },
        // set current item
        setCurrentItem:function(item){
            data.currentItem=item;

        },
        getCurrentItem:function(){
            return data.currentItem;

        },
        getTotalCalories:function(){
        let total=0;
        // loop through itmes and add cals
        data.items.forEach(function(item){
            total+=item.calories;
        });

        // set total cal in data structure
        data.totalCalories=total;
        //   return total
        return data.totalCalories;
        },
        logData:function(){
        
            return data;
        }
    }
})()
// ui controller
const UICtrl=(function(){
    const UISelectors={
     itemList:'#item-list',
     listItems:'#item-list li',
     addBtn:'.add-btn',
     updateBtn:'.update-btn',
     backBtn:'.back-btn',
     clearBtn:'.clear-btn',
     deleteBtn:'.delete-btn',
     itemNameInput:'#item-name',
     itemCaloriesInput:'#item-calories',
     totalCalories:'.total-calories',

    }
        // public methods
    return{
        populateItemList:function(items){
            let html='';

            items.forEach(function(item) {
                html+=` <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong><em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>

                </a>
            </li>`;
            });
            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML=html;
        },
        getItemInput:function(){
            return{
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            
        }
    },
    addListItem:function(item){
        // show the list 
        document.querySelector(UISelectors.itemList).style.display='block';
        // create li element
        const li=document.createElement('li');
        // add class
        li.className='collection-item';
        // add id
        li.id=`item-${item.id}`;
        // add html
        li.innerHTML=`<strong>${item.name}:</strong><em>${item.calories} calories</em>
        <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>

        </a>`;

        // insert itme
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li)
    },
    updateListItem:function(item){
        let listItems=document.querySelectorAll(UISelectors.listItems);

        // convert nodelist into array
        listItems=Array.from(listItems);

        listItems.forEach(function(listItem){
            const itemID=listItem.getAttribute('id');

            if(itemID===`item-${item.id}`){
                document.querySelector(`#${itemID}`).innerHTML=`<strong>${item.name}:</strong><em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
        
                </a>`
            }
        })
    },
    deleteListItem:function(id){
        const itemId=`#item-${id}`;
        const item=document.querySelector(itemId);
        item.remove();

    },

    clearInput:function(){
        document.querySelector(UISelectors.itemNameInput).value='';
        document.querySelector(UISelectors.itemCaloriesInput).value='';
    },
    addItemToForm:function(){
        document.querySelector(UISelectors.itemNameInput).value=ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value=ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditstate();

    },
    removeItems:function(){
       let listItems=document.querySelectorAll(UISelectors.listItems);

    //    turn node into array
    listItems=Array.from(listItems);

    listItems.forEach(function(item){

        item.remove();
    });

    },
    hideList:function(){
        document.querySelector(UISelectors.itemList).style.display='none';

    },
    showTotalcalories:function(totalcalories){
        document.querySelector(UISelectors.totalCalories).textContent=totalcalories;
    },
    clearEditState:function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display='none';
      document.querySelector(UISelectors.deleteBtn).style.display='none';
      document.querySelector(UISelectors.backBtn).style.display='none';
      document.querySelector(UISelectors.addBtn).style.display='inline';

    },
    showEditstate:function(){
        // UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display='inline';
        document.querySelector(UISelectors.deleteBtn).style.display='inline';
        document.querySelector(UISelectors.backBtn).style.display='inline';
        document.querySelector(UISelectors.addBtn).style.display='none';
  
      },
        getSelectors:function(){
            return UISelectors;
        }
       }
})()

// app controller
const App=(function(ItemCtrl,StorageCtrl,UICtrl){
    // load event listner
    const loadEventListner=function(){
        const UISelectors=UICtrl.getSelectors();

        // add item event
     document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

    //  disable submit on enter
    document.addEventListener('keypress',function(e){
        if(e.keyCode===13 || e.which===13){
            e.preventDefault();
            return false;

        }
    })
//   edit icon click event
      document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

    //   update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
     
    //   delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemdeleteSubmit);
    //  back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

     //  clear  button event
     document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
   }


//    add item submit
const itemAddSubmit=function(e){
    // get form input from ui controller
    const input=UICtrl.getItemInput();
    
    // check for name and calorie input
    if(input.name !=='' && input.calories !==''){
        // add item
       const newItem= ItemCtrl.addItem(input.name,input.calories);
    //    add item to ui list
     UICtrl.addListItem(newItem);

    //  get total calories
    const totalCalories=ItemCtrl.getTotalCalories();

    // add total calories to ui
    UICtrl.showTotalcalories(totalCalories);

    // store in local storage
    StorageCtrl.storeItem(newItem);

    //  clear fields
    UICtrl.clearInput();
    }

    e.preventDefault();
}
//  click edit item
    const itemEditClick=function(e){
        if(e.target.classList.contains('edit-item')){

        //    get list itme id(item-0,item-1)
        const listId=e.target.parentNode.parentNode.id;
       
        // break into an array
        const listIdArr=listId.split('-');
        
        // get the actual id
        const id=parseInt(listIdArr[1]);
        

        // get entire item
        const itemToEdit=ItemCtrl.getItemById(id);
        

        // // set to current item
        ItemCtrl.setCurrentItem(itemToEdit);
        

        // add item to form
        UICtrl.addItemToForm();
    }
     e.preventDefault();

    }

    const itemUpdateSubmit=function(e){

        // get item input
        const input=UICtrl.getItemInput();

        // update item
        const updatedItem=ItemCtrl.updateItem(input.name,input.calories);

        // update Ui 
        UICtrl.updateListItem(updatedItem);
        
        // get total calories
        const totalCalories=ItemCtrl.getTotalCalories();

    
         // add total calories to ui
        UICtrl.showTotalcalories(totalCalories);

        // update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        
        e.preventDefault();
    }

    // delete button submit
    const itemdeleteSubmit=function(e){
        // get current item id
        const currentItem=ItemCtrl.getCurrentItem();
        //  console.log(currentItem)
        // delet from state
        ItemCtrl.deleteItem(currentItem.id);

        // delete from ui
        UICtrl.deleteListItem(currentItem.id)

        // get total calories
        const totalCalories=ItemCtrl.getTotalCalories();

    
         // add total calories to ui
        UICtrl.showTotalcalories(totalCalories);

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // clear item event
    const clearAllItemsClick=function(){
    //    delete all items from state
    ItemCtrl.clearAllItems();

    // get total calories
    const totalCalories=ItemCtrl.getTotalCalories();

    
    // add total calories to ui
   UICtrl.showTotalcalories(totalCalories);

    // remove from Ui
    UICtrl.removeItems();

    // claer from local storage
    StorageCtrl.clearItemsFromstorage();

    // hide Ul
    UICtrl.hideList();


    }
     // public methods
    return{
        init:function(){
            // clear edit state /set initial set
            UICtrl.clearEditState();
            // fetch items from datastructure
            const items=ItemCtrl.getItems();

            // check if any items
            if(items.length===0){
                UICtrl.hideList();

            }else{
                // populates list with items
            UICtrl.populateItemList(items)
            }
             //  get total calories
             const totalCalories=ItemCtrl.getTotalCalories();

             // add total calories to ui
             UICtrl.showTotalcalories(totalCalories);
             // load event listner
            loadEventListner();

        }
    }
   
})(ItemCtrl,StorageCtrl,UICtrl);

// initialize app
App.init();



