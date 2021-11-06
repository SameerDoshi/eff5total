const prod = {
   // url: 'https://eff5api.azurewebsites.net/cache/',
   // imgbase:'https://eff5api.azurewebsites.net/cache/images/',
    url: 'https://eff5.blob.core.windows.net/ddevv/',
    apiurl:'https://eff5lservices.azurewebsites.net/api/',
    imgbase:'https://eff5.z20.web.core.windows.net/images/',
    base:"https://eff5.io/",
    defimgurl: 'https://eff5.z20.web.core.windows.net/images/default.png',   
    graphurl:'https://eff5fl.azurewebsites.net/api/graphql'
  
}; 
const dev = {
    url: 'https://eff5.blob.core.windows.net/ddevv/',
    apiurl:'https://eff5lservices.azurewebsites.net/api/',
    imgbase:'https://eff5.z20.web.core.windows.net/images/',
    defimgurl: 'https://eff5.z20.web.core.windows.net/images/default.png',
    graphurl:'/api/graphql',
    base:"/",
    //graphurl:'http://localhost:7070/api/graphql',
    
}; 
export const config = process.env.NODE_ENV === 'development' ? dev: prod;