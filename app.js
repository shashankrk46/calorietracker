// storage controller

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
        items:[

            {id:0,name:'Steak Dinner',calories:1200},
            {id:1,name:'Cookies',calories:400},
            {id:2,name:'Eggs',calories:300}
        ],
        currentItem:null,
        totalcalories:0
    }
    // public methods
    return{
        getItems:function(){
            return data.items;
        },
        addItem:function(name,calories){
            let ID;
            // create id
            if(data.items.lenght>0){
              ID=data.items[data.items.length-1].id+1;
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
        logData:function(){
            return data;
        }
    }

   
})()



// ui controller
const UICtrl=(function(){
    const UISelectors={
     itemList:'#item-list',
     addBtn:'.add-btn',
     itemNameInput:'#item-name',
     itemCaloriesInput:'#item-calories'
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
        getSelectors:function(){
            return UISelectors;
        }


    }


})()



// app controller
const App=(function(ItemCtrl,UICtrl){
    // load event listner
    const loadEventListner=function(){
        const UISelectors=UICtrl.getSelectors();

        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
   }

//    add item submit
const itemAddSubmit=function(e){
    // get form input from ui controller
    const input=UICtrl.getItemInput();
    
    // check for name and calorie input
    if(input.name !=='' && input.calories !==''){
        // add item
       const newItem= ItemCtrl.addItem(input.name,input.calories)
    }

    e.preventDefault();
}
     
    // public methods
    return{
        init:function(){
            // fetch items from datastructure
            const items=ItemCtrl.getItems();
            
            // populate list with items
            UICtrl.populateItemList(items)

            // load event listner
            loadEventListner();

        }
    }
   
})(ItemCtrl,UICtrl);

// initialize app
App.init();



