import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../lib/sanity";

sanityClient.config({
   token:process.env.TOKEN
});
// Property 'likes' does not exist on type 'void | SanityDocument<any>'.
type SanityDocument = {
   data:{
      likes: string
   }
 }



const likeButtonHandler = async( req: NextApiRequest, res: NextApiResponse ):Promise<void>=>{

   const { _id } = JSON.parse(req.body)
   const data = await sanityClient
   .patch(_id)
   .setIfMissing({likes:0})
   .inc({likes:1})
   .commit()
   .catch( error=>console.log(error))

   res.status(200).json({ likes: data });


}

export default likeButtonHandler