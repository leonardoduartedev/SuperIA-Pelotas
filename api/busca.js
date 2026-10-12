export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 const {produto='arroz'}=req.query;
 try{
  const url=`https://menorpreco.notafiscalgaucha.rs.gov.br/api/v1/produtos?termo=${encodeURIComponent(produto)}&municipio=Pelotas&raio=15`;
  const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0'}});
  const data=await r.json();
  const resultados=(data.produtos||data||[]).slice(0,20).map(p=>({
   mercado:p.estabelecimento?.nomeFantasia||p.nomeFantasia||'Mercado',
   endereco:p.estabelecimento?.endereco||'',
   preco:parseFloat(p.precoMenor||p.preco||0),
   distancia:p.distancia?p.distancia.toFixed(1)+'km':''
  })).filter(p=>p.preco>0);
  if(resultados.length==0) throw new Error('vazio');
  return res.status(200).json({fonte:'REAL Nota Gaúcha',resultados});
 }catch(e){
  return res.status(200).json({fonte:'DEMO - Pelotas',resultados:[
   {mercado:"Krolow - Areal",preco:24.9,endereco:"Av. Dom Joaquim 1230",distancia:"0.8km"},
   {mercado:"Stock Center - Fragata",preco:26.5,endereco:"Av. Duque de Caxias",distancia:"2.1km"},
   {mercado:"Treichel - Centro",preco:25.2,endereco:"Rua Gal. Osório",distancia:"1.4km"},
   {mercado:"Guanabara - Centro",preco:27.9,endereco:"Voluntários",distancia:"1.2km"},
   {mercado:"Nacional - Laranjal",preco:28.5,endereco:"Av. Rio Grande",distancia:"5.2km"}
  ]});
 }
    }
