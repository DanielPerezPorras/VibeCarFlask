import React, {useEffect, useState } from 'react'
import '../Styles/Profile.css'
import { useMatch } from 'react-router-dom';

export const Profiles = (props) => {
    //Para coger el id
    const routeData = useMatch('/profile/:id');
    const personaId = routeData !== null ? routeData.params.id : '';

    const {usuarioActual, API} = props
    const id = personaId
    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [link_paypal, setLink_Paypal] = useState("")
    const [url_foto_perfil, setUrl_Foto_Perfil] = useState("")
    const [rol, setRol] = useState("");
    const [valoraciones, setValoraciones] = useState([])
    const [media, setMedia] = useState([])
    
    const getValoraciones = async () => {
        const respuesta = await fetch(`${API}/api/v1/valoraciones/${id}`)
        const data = await respuesta.json();
        setValoraciones(data.valoraciones);
        setMedia(data.media);
    }
    
    const getUsuario = async() => {
        //e.preventDefault();
        const respuesta = await fetch(`${API}/api/v1/usuarios/${id}`)
        const data = await respuesta.json();
        setNombre(data.nombre);
        setApellidos(data.apellidos);
        setEmail(data.email);
        setTelefono(data.telefono);
        setLink_Paypal(data.link_paypal);
        setUrl_Foto_Perfil(data.url_foto_perfil);
        setRol(data.rol);
    }

    useEffect(() => {
        getUsuario();
        getValoraciones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) //[] para que se ejecuta nada más abrir la pagina

    const switchMedia = (mediaAux) => {
        switch(mediaAux) {
  
          case 1:   return <div><i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star checked"></i>
                                <i className="bi bi-star checked"></i>
                                <i className="bi bi-star checked"></i>
                                <i className="bi bi-star checked"></i></div>;
          case 2:   return <div><i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star checked"></i>
                                <i className="bi bi-star checked"></i>
                                <i className="bi bi-star checked"></i></div>;
          case 3:   return <div><i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star checked"></i>
                                <i className="bi bi-star checked"></i></div>;
          case 4:   return <div><i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star checked"></i></div>;
          case 5:   return <div><i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i>
                                <i className="bi bi-star-fill checked"></i></div>;
  
          default:      return <div><i className="bi bi-star checked"></i>
                                    <i className="bi bi-star checked"></i>
                                    <i className="bi bi-star checked"></i>
                                    <i className="bi bi-star checked"></i>
                                    <i className="bi bi-star checked"></i></div>;
        }
    }

    return (
        <div className='container-full'>
            <div className="content container-left">
                    <div className='circular-div'>
                        <img    className="profile-pic"
                                title={`Imagen de ${nombre} ${apellidos}`}
                                alt={`Imagen de ${nombre} ${apellidos}`}
                                src={url_foto_perfil}
                        />
                    </div>
                    <>
                    <span className='profile-name'>{`Perfil de ${nombre} ${apellidos}`}</span>
                    <span className='profile-email'>{`${email}`}</span>
                    <span className='profile-media'>{ switchMedia(media) }</span>
                    <div className='profile-number'><i className="bi bi-telephone icono-movil"></i><div>{telefono}</div></div>
                    <div className='profile-rol'>
                        {rol > 1 &&
                            <div><i className="bi bi-sunglasses">Admin</i></div>
                        }
                    </div>
                    <div className='profile-paypal'>
                        <a href={link_paypal} className="btn btn-outline-info"><i className="bi bi-paypal"></i>{`Paypal de ${nombre} ${apellidos}`}</a>
                    </div>
                    </>
            </div>
            <div className="content container-right">
                    <div className='form-comentarios'>
                        <h2>Valoraciones</h2>
                        {
                            (valoraciones.length < 1) ?
                            <h3>Vaya, no hay valoraciones😕</h3>
                            :
                            <div className='comentarios'>
                            {valoraciones.map(valoracion => (
                                <div className='comentario' key={valoracion._id}>
                                    <div className='foto-grid'>
                                        <div className='circular-div comentario-pic'>
                                            <img    className="profile-pic"
                                                    title={`Imagen de ${valoracion.nombre} ${valoracion.apellidos}`}
                                                    alt={`Imagen de ${valoracion.nombre} ${valoracion.apellidos}`}
                                                    src={valoracion.url_foto_perfil}
                                            />
                                        </div>
                                    </div>
                                    <div className='comentario-grid'>
                                        <span className='comentario-name'>{` ${valoracion.nombre} ${valoracion.apellidos}`}</span>
                                        <span className='comentario-texto'>{` ${valoracion.descripcion}`}</span>
                                    </div>
                                    <div className='estrellas-grid'>
                                        {switchMedia(Number(valoracion.nota))}
                                    </div>
                                </div>
                            ))}
                            </div>
                        }
                    </div>
            </div>
        </div>
    )
}