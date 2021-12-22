import React, { useState } from 'react'
import '../Styles/Profile.css'

export const Profile = (props) => {
    const {usuarioActual, API} = props
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
    const [file, setFile] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setEditing(true);
    }

    const cambiarFoto = async(e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('file', file);
        console.log(`${API}/api/v1/usuarios/${id}`)
        const respuesta = await fetch(`${props.API}/api/v1/usuarios/image/${id}`, {
            method: 'PUT',
            body: formData
        })
        const data = await respuesta.json();
        console.log(data)
        if (data.msg == "El archivo no es una imagen")
        {
            alert("El archivo no es una imagen")
        }else{
            setUrl_Foto_Perfil(data.msg)
            alert("Tu imagen se ha subido")
        }
    }

    const actualizarUsuario = async (e) => {
        e.preventDefault();
        setEditing(false);
        const respuesta = await fetch(`${API}/api/v1/usuarios/${id}`, {
            method: 'PUT',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                apellidos: apellidos,
                email: email,
                telefono: telefono,
                contrasenia: contrasenia,
                link_paypal: link_paypal,
                url_foto_perfil: url_foto_perfil,
                rol: rol
            })
        })
        const data = await respuesta.json();
        console.log(data)
    }

    return (
        <div className='container-full'>
            <div className="content container-left">
                
                    <img    className="profile-pic"
                            title={`Imagen de ${nombre} ${apellidos}`}
                            alt={`Imagen de ${nombre} ${apellidos}`}
                            src={url_foto_perfil}
                    />
                {!editing ?
                    <>
                    <span className='profile-name'>{`Perfil de ${nombre} ${apellidos}`}</span>
                    <span className='profile-email'>{`${email}`}</span>
                    <div className='profile-number'><i className="bi bi-telephone icono-movil"></i><div>{telefono}</div></div>
                    <div className='profile-rol'>
                        {rol > 1 &&
                            <div><i clasName="bi bi-sunglasses">Admin</i></div>
                        }
                    </div>
                    <div className='profile-paypal'>
                        <a href={link_paypal} className="btn btn-outline-info"><i className="bi bi-paypal"></i>{`Paypal de ${nombre} ${apellidos}`}</a>
                    </div>
                    <form onSubmit={handleSubmit}>
                    
                        <button className="btn btn-primary btn-block btn-edit">
                            <i className="bi bi-pencil-square"></i> Actualizar
                        </button>
                    
                    </form>
                    </>
                    :
                    <div className="custom-file input-file mb-2">
                        {/* <input type="file" className="custom-file-input file-button" id="archivoFoto" accept="image/png, image/jpeg"/> */}
                        <form onSubmit={cambiarFoto}>
                            <input type="file"
                                id="file" 
                                onChange={(e) => setFile(e.target.files[0])}
                                className="custom-file-input file-button"
                                accept="image/png, image/jpeg"
                                placeholder="Imagen en .png o .jpg"/> 
                            
                                <button type="submit" className="btn btn-primary">
                                    <i className="bi bi-pencil-square"></i> Guardar foto
                                </button>
                        </form>
                    </div>
                }
            </div>
            <div className="content container-right">
                {editing ?
                    <div className='form-update'>
                    <h2>Mis detalles</h2> 
                    <form onSubmit={actualizarUsuario}>
                        <div className="form-group mb-2">
                            <label htmlFor="email">Correo</label>
                            <input type="email"
                            id="email" 
                            onChange={e => setEmail(e.target.value)} 
                            value={email}
                            className="form-control"
                            placeholder="Su correo..."
                            autoFocus/>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text"
                            id="nombre" 
                            onChange={e => setNombre(e.target.value)} 
                            value={nombre}
                            className="form-control"
                            placeholder="Su nombre..."/>                        
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="apellidos">Apellidos</label>
                            <input type="text"
                            id="apellidos" 
                            onChange={e => setApellidos(e.target.value)} 
                            value={apellidos}
                            className="form-control"
                            placeholder="Sus apellidos..."/>  
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="telefono">Tel&eacute;fono</label>
                            <input type="text"
                            id="telefono" 
                            onChange={e => setTelefono(e.target.value)} 
                            value={telefono}
                            className="form-control"
                            placeholder="Su tel&eacute;fono..."/> 
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="contrasena">Contrase&ntilde;a</label>
                            <input type="password"
                            id="contrasena" 
                            onChange={e => setContrasenia(e.target.value)} 
                            value={contrasenia}
                            className="form-control"
                            placeholder="Su contras&ntilde;a..."/> 
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="link_paypal">Correo</label>
                            <input type="url"
                            id="link_paypal" 
                            onChange={e => setLink_Paypal(e.target.value)} 
                            value={link_paypal}
                            className="form-control"
                            placeholder="Introduzca su link de PayPal"/>
                        </div>
                        <div className="btn-actualizar mb-2">
                            <button type="submit" className="btn btn-primary">
                                <i className="bi bi-pencil-square"></i> Actualizar mis datos
                            </button>
                        </div>
                    </form>
                    </div> : 
                'Create'}
            </div>
        </div>
    )
}