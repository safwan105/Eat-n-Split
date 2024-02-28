import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children,onClick}){
  return(
  <button className="button" onClick={onClick}>{children}</button>
  )
}

export default function App(){

  const [datas,setData]=useState(initialFriends)

  const[showAddFriend,setShowAddFriend]=useState(false)

  const[selectedFriend,setSlectedFirend]=useState(false)

  function handleShowAddFriend(){
    setShowAddFriend((show)=>!show)
  }

  function handleAddFriend(data){
    setData((datas)=>[...datas,data])
    setShowAddFriend(false)
  }
  function handleSlection(el){
    //setSlectedFirend(el)
    setSlectedFirend((cur)=>cur?.id===el.id ?null:el)
    setShowAddFriend(false)
  }
  function handleBillSplit(value){

    setData((datas)=>
      datas.map((data)=>
        data.id === selectedFriend.id ?{...data,balance: data.balance + value}
        :data
        )
      )
      setSlectedFirend(null)
  }

  return(
    <div className="head">
    <h1 style={{backgroundColor:"#ff922b",
              color:"black",
              borderRadius:"5px",
              textTransform:"uppercase",
              padding:"5px"}}>
    Eat N Split</h1>
    <div className="app">
      
      <div className="sidebar">
        <FriendsList datas={datas} onSelction={handleSlection} selectedFriend={selectedFriend} />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}

        <Button onClick={handleShowAddFriend}>{showAddFriend ?"Close":"Add friend"}</Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleBillSplit}/>}
    </div>
    </div>
  )
}

function FriendsList({datas,onSelction,selectedFriend}){
  return(
    <ul>
      {datas.map((el)=>
      <Friends el={el} onSelction={onSelction} selectedFriend={selectedFriend} key={datas.id}/>
      )}
    </ul>
  )
}
function Friends({el,onSelction,selectedFriend,key}){

  const isSelected =selectedFriend?.id===el.id
  return(
    <li className="select" >
      <img src={el.image} alt={el.name}/>
      <h3>{el.name}</h3>
      {el.balance <0 && <p className="red">You owes {el.name} {Math.abs(el.balance)}$</p>}
      {el.balance >0 && <p className="green">{el.name} owes you {Math.abs(el.balance)}$</p>}
      {el.balance === 0 && <p>You and {el.name} are  even</p>}
      <Button onClick={()=>onSelction(el)}>{isSelected ?"Close":"Select"}</Button>
    </li>
  )
}



function FormAddFriend({onAddFriend}){
  const[name,setName]=useState('')
  const[image,setImage]=useState('https://i.pravatar.cc/48')

  function handleSubmit(e){
    e.preventDefault()

    if(!name||!image) return null

    const id=crypto.randomUUID()
    const newFriend={
      id,
      name,
      balance:0,
      image,
      
    }
    onAddFriend(newFriend)
    
    setName('')
    setImage('https://i.pravatar.cc/48')
  }
  return(
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🫂Friend name</label>
        <input 
        type="text" 
        value={name}
        onChange={e=>setName(e.target.value)}
            
        />

      <label> 🖼️Image URL</label>
        <input 
        type="text" 
        value={image}
        onChange={e=>setImage(e.target.value)}
          
        />
      <button className="button">Add</button>
      <button className="button">Close</button>
    </form>
  )
}

function FormSplitBill({selectedFriend,onSplitBill}){

  const[bill,setBill]=useState("")
  const[userExpense,setUserExpens]=useState("")
  const paidByFriend=bill-userExpense
  const[whoIspaying,setWhoIsPaying]=useState("user")

  function handleSubmit(e){
    e.preventDefault()

    if(!bill||!userExpense) return
    onSplitBill(whoIspaying ==='user'? paidByFriend:-userExpense)
    //paidByFriend : that person owes you mone / useExpense:  
  }

  return(
    <div>
        <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split the bill with {selectedFriend.name}</h2>
          <label>📃Bill</label>
            <input type="text" 
            value={bill} 
            onChange={(e)=>setBill(Number(e.target.value))}>  
            </input>

          <label>💳Your Expense</label>
            <input type="text" 
              value={userExpense} 
              onChange={(e)=>setUserExpens(Number(e.target.value)>bill ? userExpense:Number(e.target.value))}>
            </input>

          <label>🤦‍♂️{selectedFriend.name}'s Expense</label>
            <input type="text" disabled value={paidByFriend}></input>

          <label>🫰Who is payig bill?</label>
            <select 
            value={whoIspaying} 
            onChange={(e)=>setWhoIsPaying(e.target.value)}>
              <option value="user">You</option>
              <option value="friend">{selectedFriend.name}</option>
            </select>

          <button className="button">Split</button>
        </form>
    </div>
  )
}