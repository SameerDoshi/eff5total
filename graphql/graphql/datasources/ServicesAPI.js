const { RESTDataSource } = require('apollo-datasource-rest');
const { CosmosClient } = require('@azure/cosmos');



class ServicesAPI extends RESTDataSource {
  constructor() {
    super();
    this.client = new CosmosClient(process.env.cosmos);
    //this.baseURL = 'http://localhost:7071/api/';
    this.baseURL = 'https://eff5lservices.azurewebsites.net/api/';
  }
  getTagCollection(){
    return this.client.database("storydb").container("topics");
  }

  getStoryCollection(){
    return this.client.database("storydb").container("storycollection");
  }

  async updatedoc(td,pk,story){
    
    let {resource} = await this.getTagCollection().item(td,pk).read();
    if(resource){
      let index = resource.hot.map(function(e) { return e.id; }).indexOf(story.id);
      resource.hot.splice(index,1,story);
      delete story.comments;      
      delete story["_rid"];
      delete story["_self"];
      delete story["_etag"];
      delete story["_attachments"];
      delete story["_ts"];
      await this.getTagCollection().item(td,pk).replace(resource);
    }
    
  }

  formatDate(ind){
    var gt = new Date(ind);
        
        var d = new Date(gt),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
            
            return([year, month, day].join(''));
  }

  async submit ({title, url, text, tagName}){
    let body={
      title: title,
      url: url,
      text: text,
      tagName: tagName
    };
    let res=await this.post('postsubmit', body)
    console.log(res);
    return res;
  }

  async newtag ({tagName}){
    let body={
      name: tagName
    };
    let res=await this.post('postnewtag', body)
    console.log(res);
    return res;
  }

  async comment({sid, pk, message,rid}){
    const {resource} =await this.getStoryCollection().item(sid,pk).read();
    
    
    
    if(resource){
        let nComment={
          id:resource.comments.length+1,
          message:message,
          parent:rid,
          comments:[]
        };
        console.log(rid);
        console.log(message);
        
      if(!rid)  {
        resource.comments.push(nComment);
      }else{
        
        let depth=rid.split(",");
        
        let elementPos = resource.comments.map(function(x) {return parseInt(x.id); }).indexOf(parseInt(depth[0]));  ;;
        let pComment=resource.comments[elementPos];
        
        var t;
        for (let index = 1; index < depth.length; index++) {
          elementPos = pComment.comments.map(function(x) {return parseInt(x.id); }).indexOf(parseInt(depth[index]));  ;;
          
          pComment=pComment.comments[elementPos];
          nComment.parent=depth[index];
          
          
        }
        
        
        if(!pComment.comments){
          pComment.comments=[];
        }
        nComment.id=pComment.comments.length;
        pComment.comments.push(nComment);
        //resource.comments.splice(elementPos,1,pComment);
      }
      resource.comment_count++;
              
      await this.getStoryCollection().item(sid,pk).replace(resource);
      let td=pk+"-"+this.formatDate(resource.posted)
      await this.updatedoc(td,pk,JSON.parse(JSON.stringify(resource)) );
      
    }
    
    return resource;
  }

  findComment(comments,id){
    var elementPos = comments.map(function(x) {return x.id; }).indexOf(id);  
    let pComment=comments[elementPos];
    return pComemnt;
  }

  async vote({sid,pk,t}){
    const {resource} =await this.getStoryCollection().item(sid,pk).read();
    if(resource){
      t==="u"?resource.points++:resource.points--;
      await this.getStoryCollection().item(sid,pk).replace(resource)
      let td=pk+"-"+this.formatDate(resource.posted)
      await this.updatedoc(td,pk,resource);
    }
    return resource;
  }

  async getAllTags() {
    let results = await this.client
            .database("storydb")
            .container("topics")
            .items.query({
                query: 'SELECT * FROM c where c.id="list" ',
            })
            .fetchAll();

    return results.resources.length >=1 ?
    results.resources[0].topics:
    [{"name":"news","id":1}];
   
  }

  async getStoriesByTag({ tagname }) {
    let pk=tagname.split("-20")[0];
    let {resource} = await this.getTagCollection()
        .item(tagname,pk).read();

return resource ?resource.hot:[];
  }

  async getStoriesByDate({tagName,date}){
    let results = await this.client
    .database("storydb")
    .container("storycollection")
    .items.query({
        query: 'SELECT * FROM c where c.id="'+tagName +'"',
    })
    .fetchAll();

return results.resources[0].hot ;

  }
  async getStoryByStory({ storyId }) {
    let results = await this.getStoryCollection()
    .items.query({
        query: 'SELECT * FROM c where c.id="'+storyId+'"',
    })
    .fetchAll();
    
    return results.resources.length>=0 ?
    results.resources[0]:{};
  }
  async getCommentsByStory({ storyId }) {
    let results = await this.getStoryCollection()
    .items.query({
        query: 'SELECT * FROM c where c.id="'+storyId+'"',
    })
    .fetchAll();
    
    return results.resources.length>=0 ?
    results.resources[0]:{};
   
  }

  getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId })),
    );
  }
  storyReducer(story){
    return {
      id:story.id,
      url:story.url,
      comment_count:story.comment_count,
      Headline:story.headline,
      text:story.text,
      points:story.points
    };
  }
  tagReducer(tag) {
    return {
      id: tag.id || 0,
      name: tag.name || 'hey'
    };
  }
}
module.exports = ServicesAPI;