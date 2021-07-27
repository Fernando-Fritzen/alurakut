import { SiteClient } from 'datocms-client';


export default async function recebedorDeRequest(request, response) {
    
    if(request.method === 'POST') {

        const TOKEN = '5713ff8cb183f87910772d4e4623db';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "1011148",
            ...request.body,
            // title: "Comunidade de Teste",
            // imageUrl: "https://github.com/fernando-fritzen.png",
            // creatorSlug: "fernando-fritzen"
        })
        

        console.log(TOKEN);
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}