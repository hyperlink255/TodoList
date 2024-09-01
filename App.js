import React,{useState}from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'
import { useEffect } from 'react'
const initialData = {
    todo:null,
    status:"pending"
}
const App = () => {
    const todoUrl = 'http://localhost:4200/todo'
    const[todoData , setTodoData] = useState(initialData);
    const[edittodoname , setEditTodoName] = useState('')
    const[editToggle, setEditToggle] = useState(false)
    const [data , setData] = useState([])      
    const [rowIndex ,setrowIndex] = useState(null);
    const [searchtext , setSearchText] = useState('')
    const [value ,getVlaue] = useState({
        dCount : 0,
        eCount : 0

    })
    const [count, setCount] = useState({
        Pcount : null,
        Ccount : null
    })
    function handleChange(event){
        setTodoData((prev)=>({...prev, todo : event.target.value}))
    }
    
const handleSubmit = () =>{
    if(!todoData){
    }else{
        axios.post(todoUrl ,todoData).then((res)=>{
            document.getElementById('addtodo').value = ""
            getTodoData();
             }).catch((err)=>{
            console.log(err)
        })
        setTodoData('')
        

    }
    

    }
        


const getTodoData = ()=>{
        axios.get(todoUrl).then((res)=>{
            console.log(res, "complite")
            setData(res.data)
            getVlaue({dCount: res.data.filter((item)=> item.status === "Completed").length,eCount : res.data.filter((item)=> item.status === "pending").length})
            setCount({
                Pcount :res.data.filter((item)=>item.status === "pending").length,
                Ccount :res.data.filter((item)=>item.status === "Completed").length,

            })
        }).catch((err)=>{
            console.log(err)
        })
    }
    
const handleDelete = (data) => {
    console.log(data.id);
    axios.delete(`${todoUrl}/${data.id}`).then((res)=>{
    
        getTodoData()
    }).catch((err)=>{
        console.log(err)
 
    })
}

const markAsComplete = (event,data)=>{
    const {checked} = event.target;
    console.log(checked);
    const {id} = data;
    console.log(id);
    axios.patch(`${todoUrl}/${id}`,{
    status: checked ? 'Completed' : 'pending'
    }).then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
}



useEffect(()=>{
    getTodoData()
},[])

const handleEditTodo = (item, index)=>{
    setrowIndex(index)
    console.log(item);
    setEditToggle(true)

}
const handleEditSubmit = (item)=>{
    console.log(item);
    setEditToggle(true)
    axios.patch(`${todoUrl}/${item.id}`,{
        todo : edittodoname
    }).then((res)=>{
        getTodoData()
        setEditToggle(false)
    }).catch((err)=>{
        console.log(err)
    })

}
    return(
        <>
        <div className='d-flex m-4 p-2 row'>
 {/*console.log(todoData)*/}
     <div className='col-5 d-flex'>
            <input  placeholder='addtodo' id="addtodo" onChange={handleChange}  className='form-control'/>
            <button className='btn btn-md btn-primary ms-2' onClick={handleSubmit}>Add</button>
            </div>
            <div className='col-4 d-flex'>
            <spna className='bg-primary border rounded text-white p-2 w-25'>Panding{count.Pcount}</spna>
            <span className='bg-secondary text-white border rounded p-2 mx-3 w-25'>Completed{count.Ccount}</span>
            </div>
            <div className='col-3'>
                <input className='form-control' placeholder='search Todo...' onChange={(e)=>setSearchText(e.target.value.toLowerCase())} type='search'/>
            </div>
        </div>
        <div>
        <table className="table table-striped mx-3">
  <thead> 
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Mark Done</th>
      <th scope="col">Name</th>
      <th scope="col">Status</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
    {
      data.filter(item => item.todo.includes(searchtext)).map((item,index)=>{
            return (
            <tr>
            <th scope="row">{index + 1}</th>
            <th scope ="row"><input onChange={(e)=>markAsComplete(e,item)} type='checkbox' defaultChecked={item.status ==='compilate'}></input></th>
            <td>{editToggle && index === rowIndex ?  <input  defaultValue={item.todo}onChange={(e)=>setEditTodoName(e.target.value)} className='form-control w-50'/> : item.todo}</td>
            <td className={item.status === "pending" ? 'text-warning': item.status === 'Completed' && 'text-success'}>{item.status}</td>
            <td>
                {
                editToggle   && index === rowIndex ?
              <>
             <td><button className='btn btn-sm btn-success me-2'onClick={()=> handleEditSubmit(item)}>Save</button><button className="btn btn-sm btn-danger" onClick={()=>setEditToggle(false)}>Cancel</button></td>

                    </>
                    :
                <>
                
                <button className='btn btn-sm btn-success me-2' onClick={()=>handleEditTodo(item, index)}>Edit</button><button className="btn btn-sm btn-danger" onClick={()=>handleDelete(item)}>Delete</button>
                        </>
        }
                </td>
            
          </tr>
       // filter((item)=>item.todo.toLowerCase().includes(searchtext))
)
        })
    }
</tbody>
</table>
<Chart options={
    {
        chart:{type:"dount"},
        labels :['Completed' ,'Pending']
    
     }
 } series={[value.dCount , value.eCount]} height={200} width={400}type="donut" />
</div>
</>
    )

    }
export default App