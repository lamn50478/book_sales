count=0;
const createTree=(arr , parentId="",count={value:0})=>{
      const tree=[];
      arr.forEach((item) => {
        if(item.parent_id===parentId){
         var newItem=item;
         newItem.index=count.value++;
         const children=createTree(arr,item.id,count); 
        
         if(children.length > 0){
            newItem.children=children;
           
         }
    
         tree.push(newItem);
         
        }
      });
      console.log(tree)
      return tree;
  
}
module.exports.tree=(arr , parentId="")=>{
   
     const resultTree=createTree(arr , parentId="",{value:0});
     return resultTree;
}
