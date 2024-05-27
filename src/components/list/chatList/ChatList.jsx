import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/addUser"
import { useUserStore } from "../../lib/userStore"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"

const ChatList = () => {
  const [chats, setChats] = useState([])
  const [addMode, setAddMode] = useState(false)
  const [input, setInput] = useState("")

  const { currentUser } = useUserStore()
  const { chatId, changeChat } = useChatStore()

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.receiverId)
        const userDocSnap = await getDoc(userDocRef)

        const user = userDocSnap.exists() ? userDocSnap.data() : null

        return { ...item, user }
      })

      const chatData = await Promise.all(promises)

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
    })

    return () => {
      if (typeof unSub === "function") {
        unSub()
      }
    }
  }, [currentUser.id])

  const handleSelect = async (chat) => {
    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest
    })

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true
    }

    const userChatsRef = doc(db, 'userchats', currentUser.id)

    try {
      await updateDoc(userChatsRef, {
        chats: userChats
      });
      changeChat(chat.chatId, chat.user)
    } catch (err) {
      console.log(err)
    }
  }

  const filteredChats = chats.filter(c => c.user && c.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="Search" />
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="Add"
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={`${chat.chatId}_${chat.user ? chat.user.receiverId : 'unknown'}`} 
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe' }}
        >
          <img src={chat.user && chat.user.blocked.includes(currentUser.id) ? './avatar.png' : chat.user.avatar || "./avatar.png"} alt="Avatar" />
          <div className="texts">
            <span>{chat.user && chat.user.blocked.includes(currentUser.id) ? 'User' : chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  )
}

export default ChatList
