import {useEffect, useState} from 'react'
import { useParams, useNavigate, Navigate, json } from 'react-router-dom';
import './filme-info.css'
import api from '../../services/api'
import { toast } from 'react-toastify';


function Filme(){
    const {id} = useParams();
    const Navigate = useNavigate();
    const [filme, setFilme] = useState ({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadFilme(){
            await api.get(`/movie/${id}`,{
                params:{
                    api_key:"33a0e6e4bb6246e56713ed549b7160ae",
                    language: "pt-BR",
                }
            })
            .then((response)=>{
                setFilme(response.data);
                setLoading(false);
            })
            .catch(()=>{
                Navigate("/", {replace:true});
                return;
            })
        }
        loadFilme();

        return()=>{
            console.log("Componente foi desmontado")
        }
    },[Navigate, id])


    function salvarFilme(){
        const minhaLista = localStorage.getItem("@primeflix");

        let filmeSalvos = JSON.parse(minhaLista) || [];

        const hasFilme = filmeSalvos.some((filmeSalvo)=> filmeSalvo.id === filme.id)

        if(hasFilme){
            toast.warn("Esse filme já foi salvo!")
            return;
        }

        filmeSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmeSalvos));
        toast.success("Filme salvo com sucesso!")
    }


    if (loading){
       return(
        <div className="filme-info">
            <h1>Carregando detalhes...</h1>
        </div>
       ) 
    }

    return(
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/>
            <h3>Sinopse</h3>
            <span>{filme.overview}</span>
            <strong>Avaliação: {filme.vote_average} /10</strong>

            <div className="area-buttons">
                <button onClick={salvarFilme}>Salvar</button>
                <button>
                    <a target="blank" rel="external" href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                        Trailer
                    </a>
                </button>
            </div>
        </div>
    )
}

export default Filme;