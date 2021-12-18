import React, { useState } from 'react'
import '../Styles/Profile.css'

export const Profile = (props) => {
    const {usuarioActual} = props
    console.log(usuarioActual)    
    const [id, setId] = useState(usuarioActual._id)
    const [nombre, setNombre] = useState(usuarioActual.nombre)
    const [apellidos, setApellidos] = useState(usuarioActual.apellidos)
    const [email, setEmail] = useState(usuarioActual.email)
    const [telefono, setTelefono] = useState(usuarioActual.telefono)
    const [contrasenia, setContrasenia] = useState(usuarioActual.contrasenia)
    const [link_paypal, setLink_Paypal] = useState(usuarioActual.link_paypal)
    const [url_foto_perfil, setUrl_Foto_Perfil] = useState(usuarioActual.url_foto_perfil)
    const [rol, setRol] = useState('')
    const [editing, setEditing] = useState(false)
    
    return (
        <div className='container-full'>
            <div className="content container-left">
                
                    <img    className="profile-pic"
                            title={`Imagen de ${nombre} ${apellidos}`}
                            alt={`Imagen de ${nombre} ${apellidos}`}
                            src="https://avatars.githubusercontent.com/u/62696221?v=4"
                    />
            </div>
            <div className="content container-right">

            </div>
        </div>
    )
}