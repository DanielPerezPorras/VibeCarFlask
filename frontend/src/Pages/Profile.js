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
    const [rol, setRol] = useState(usuarioActual.rol)
    const [editing, setEditing] = useState(false)
    
    return (
        <div className='container-full'>
            <div className="content container-left">
                
                    <img    className="profile-pic"
                            title={`Imagen de ${nombre} ${apellidos}`}
                            alt={`Imagen de ${nombre} ${apellidos}`}
                            src={url_foto_perfil}
                    />
                    <span className='profile-name'>{`Perfil de ${nombre} ${apellidos}`}</span>
                    <span className='profile-email'>{`${email}`}</span>
                    <div className='profile-number'><i class="bi bi-telephone icono-movil"></i><div>{telefono}</div></div>
                    <div className='profile-rol'>
                        {rol > 1 &&
                            <div><i class="bi bi-sunglasses">Admin</i></div>
                        }
                    </div>
                    <div className='profile-paypal'>
                        <a href={link_paypal} class="btn btn-outline-info"><i class="bi bi-paypal"></i>{`Paypal de ${nombre} ${apellidos}`}</a>
                    </div>
                    <button className="btn btn-primary btn-block btn-edit">
                        <i class="bi bi-pencil-square"></i> Actualizar
                    </button>
            </div>
            <div className="content container-right">
                {editing ? 
                'Update' : 
                'Create'}
            </div>
        </div>
    )
}