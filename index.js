const fs=require('fs');
const path=require('path');

// console.log(process.argv);
var props=[...process.argv.slice(2)];
// console.log(props);
var source=props[props.indexOf('-s')+1] || null;
var target=props[props.indexOf('-o')+1] || null;

console.log("source:"+source,"target:"+target);
parse(source,target);



function parse(source,target){
    if(source==null){
        console.log("specify the source file...");
        return;
    }
    var s_ext=source.slice(source.lastIndexOf('.')+1);
    var t_ext = target?target.slice(target.lastIndexOf('.') + 1):'';
    // console.log("extensions: ",s_ext,t_ext);

     if(s_ext=='csv'){
        //convert csv to json
        var data=fs.readFileSync(path.join(source),'utf8');
        // console.log(data);
        var rows=data.split('\n');
        // console.log(rows.length);
        var headRow=rows[0];
        var objectProps=headRow.split(',');
        var dataRows=rows.slice(1);
        //bring this data as json objects;
        var objects=[];
        dataRows.forEach(row=>{
            if(row.trim()!=''){
                var values = row.split(',');
                var obj = {};
                for (let i = 0; i < objectProps.length; i++) {
                    var key = objectProps[i].replace('\r', '').trim();
                    var value = values[i].replace('\r', '').trim();
                    obj[key] = value;
                }
                objects.push(obj);
            }
        });
        // showJSON(objects);
         
    if(!target){
        showJSON(objects);
        return;
    }
    else{
      var jsonData = JSON.stringify(objects);
      console.log(`data writing to the file:${target}`);
        fs.writeFile(path.join(target), jsonData,(err)=>{
            if(err){
                console.log("something went wrong..");
            }
            else{
                console.log(`data is written to the ${target} file`);
            }
        });
    }

    }
    else{
       //convert json to csv
       var jsonData=fs.readFileSync(path.join(source),'utf8');
       //console.log(jsonData);
       var jsonObj=JSON.parse(jsonData);
       var headProps=Object.keys(jsonObj[0]);
       var headrow=headProps.toString();
    //    console.log(headrow);
       var dataRows=[];
       jsonObj.forEach(obj=>{
         var row=[Object.values(obj)].toString();
        //    console.log(row);
           dataRows.push(row.concat('\n'));
       })  
        var csvData = headrow.concat('\n',dataRows.join('')); 
     
        if(!target){
            console.log(csvData); 
        }
        else{
            fs.writeFile(path.join(target),csvData,(err)=>{
                if(err){
                    console.log("something went wrong..");
                }
                else{
                    console.log(`csv data has been succesfully written to the ${target} file`);
                }
            });
        }
    }
}
function showJSON(objs){
    
    objs.forEach(obj=>{
        console.log(JSON.stringify(obj),'\n');
    })
   
}








