import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px'}}/>
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (

    <ProfileRelationsBoxWrapper>

      <h2 className="smallTitle">
        {propriedades.title} ({ propriedades.items.length })
        
      </h2>

      {/* <ul>
        {seguidores.map((item) => {
          return (
            <li key={item}>
              <a href={`https://github.com/${item}.png`} >
                <img src={item.image} />
                <span>{item.login}</span>
              </a>
            </li>
          )
        })}
      </ul> */}
    </ProfileRelationsBoxWrapper>
  
  )
}

export default function Home(props) {

  
  const githubUser = props.githubUser;

  const [comunidades, setComunidades] = React.useState([]);

  const [recados, setRecados] = React.useState([]);

  const pessoasFavoritas = [
    'omariosouto',
    'peas',
    'juunegreiros',
    'diego3g',
    'maykbrito',
    'acenelio'
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function() {

    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then(function(respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
      console.log('seguidores do Fernando' + respostaCompleta)
    })


    //API GraphQL, Dato Cms
    fetch('https://graphql.datocms.com/', {
      method: "POST",
      headers: {
        'Authorization': 'da30925f67918090f3f5910548791f',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })


    fetch('https://graphql.datocms.com/', {
      method: "POST",
      headers: {
        'Authorization': 'da30925f67918090f3f5910548791f',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
        allRecados {
          id
          recado
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const recadosVindosDoDato = respostaCompleta.data.allRecados;
      console.log(recadosVindosDoDato)
      setRecados(recadosVindosDoDato)
    })


  }, [])
  console.log('seguidores antes do return', seguidores);
  return(
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser}/>
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que voc?? deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async(response) => {
                const dados = await response.json();
                console.log(dados.registroCriado);
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas)
              })

            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>

            </form>
          </Box>

          <Box>

          <h2 className="subTitle">Deixe seu recado</h2>
            <form onSubmit={function handleCriaRecado(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const recado = {
                recado: dadosDoForm.get('recado'),
                creatorSlug: githubUser
              }

              fetch('/api/recados', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(recado)
              })
              .then(async(response) => {
                const dados = await response.json();
                console.log(dados.registroCriado);
                const recado = dados.registroCriado;
                const recadosAtualizadas = [...recados, recado];
                setRecados(recadosAtualizadas)
              })

            }}>

                <div>
                  <input
                    placeholder="Escreva o seu recado"
                    name="recado"
                    aria-label="Escreva o seu recado"
                    type="text"
                  />
                </div>

                <button>
                  Criar recado
                </button>

            </form>

          </Box>

          <Box >
            <h2 className="subTitle">Recados..</h2>

            <div>
              <ul >
                {recados.map((item) => {
                  return (
                    <li key={item.id} style={{ listStyle:'none', marginTop:'15px', background:'rgba(0,0,0,.07)', borderRadius:'10px', padding:'15px'}}>
                      <div style={{ display:'flex', alignItems:'center', marginBottom:'20px'}}>
                        <img src={`https://github.com/${item.creatorSlug}.png`} style={{width:'60px', height:'60px', borderRadius:'50%', marginRight:'20px'}} />
                        <h4>{item.creatorSlug}</h4>
                      </div>
                      <span>{item.recado}</span>
                    </li>
                  )
                })}
              </ul>
              
            </div>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          
          {/* <ProfileRelationsBox title="Seguidores" items={seguidores}  />
         */}


          <ProfileRelationsBoxWrapper>

          <h2 className="smallTitle">
            Seguidores ({ seguidores.length })
          </h2>

          <ul>
            {seguidores.slice(0,6).map((item) => {
              return (
                <li key={item.id}>
                  <a target="_blank" href={`https://github.com/${item.login}`} >
                    <img src={`https://github.com/${item.login}.png`} />
                    <span>{item.login}</span>
                  </a>
                </li>
              )
            })}
          </ul>
          </ProfileRelationsBoxWrapper>
          
          <ProfileRelationsBoxWrapper>

            <h2 className="smallTitle">
              Comunidade ({ comunidades.length })
            </h2>

            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`/comunidades/${item.id}`} >
                      <img src={item.imageUrl} />
                      <span>{item.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({ pessoasFavoritas.length })
            </h2>

            <ul>
              {pessoasFavoritas.map((item) => {
                return (
                  <li key={item}>
                    <a href={`/users/${item}`} >
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

          </ProfileRelationsBoxWrapper>
          <Box>
            Comunidades
          </Box>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {

  const cookies = nookies.get(context);
  if(!cookies.USER_TOKEN) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }
  const token = cookies.USER_TOKEN
  
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((resposta) => resposta.json())
  
  
  console.log('isAuthenticated', isAuthenticated);
  const { githubUser } = jwt.decode(token);

  // if(!isAuthenticated) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false
  //     }
  //   }
  // }

  return {
    props: {
      githubUser
    }, 
  }
}
