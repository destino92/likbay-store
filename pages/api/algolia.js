// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import algoliasearch from "algoliasearch"

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, 
  process.env.ALGOLIA_ADMIN_API_KEY
)

export default async(req, res) => {
  const { 
    event, 
    payload
  } = req.body;

  const product = {
    objectID: payload.id,
    name: payload.name,
    category: payload.categories[0].name,
    description: payload.description,
    image: payload.image.url,
    price: payload.price.formatted_with_symbol,
    link: payload.permalink,
    marque: payload.attributes[0].value,
    vue: payload.attributes[1].value,
    vente: payload.attributes[2].value,
    like: payload.attributes[3].value,
    boutique: payload.attributes[4].value,
    boost: payload.attributes[5].value,
    neuf: payload.attributes[6].value
  }
  
  const [resource, trigger] = event.split(".");

  const index = client.initIndex(resource);

  if(trigger === "delete") {
    await index.deleteObject(objectID);
    return res.status(204).end()
  }

  if(["create", "update"].includes(trigger)) {
    return res.status(trigger === "create" ? 201 : 202).json(
      await index.saveObject(product)
    );
  }

  res.status(422).json({ messagge: `${trigger} is not a valid trigger`});
}