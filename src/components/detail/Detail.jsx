import React from 'react'
import "./detail.css"
import { auth, db } from '../lib/firebase'
import { useChatStore } from '../lib/chatStore'
import { useUserStore } from '../lib/userStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Detail = () => {

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()

    const { currentUser } = useUserStore()
  
    const handleBlock = async () => {
        if (!user) return

        const userDocRef = doc(db, 'users', currentUser.id)

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id): arrayUnion(user.id)
            })
            changeBlock()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar || './avatar.png'} alt="" />
                <h2>{user?.username}</h2>
                <p>Durmiendo</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Configuracion de chat</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Fotos guardadas</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="Camaro.jpg" alt="" />
                                <span>Foto 1</span>
                            </div>
                            <img src="./download.png" alt=""className='icon' />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="Camaro.jpg" alt="" />
                                <span>Foto 2</span>
                            </div>
                            <img src="./download.png" alt="" className='icon'/>
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Archivos guardados</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}>
                    {
                        isCurrentUserBlocked
                        ? "Tu estas bloqueado!"
                        : isReceiverBlocked
                        ? "Usuario bloqueado"
                        : "Bloquear usuario"
                    }
                </button>
                <button className='logout' onClick={()=>auth.signOut()}>Cerrar sesion</button>
            </div>
        </div>
    )
}

export default Detail