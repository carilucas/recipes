import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { sanityClient, urlFor, usePreviewSubscription, PortableText } from '../../lib/sanity';
import { ParsedUrlQuery } from 'querystring'
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface IParams extends ParsedUrlQuery {
    slug: string
}

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
   _id,
   name,
   slug,
   mainImage,
   ingredient[]{
     _key,
     unit,
     wholeNumber,
     fraction,
     ingredient->{
       name
     }
   },
   instructions,
   likes
 }`;

type IngredientProp = {
   fraction: string
   ingredient: {
      name: string
   }
   unit: string
   wholeNumber: string
   _key: string
}

const Recipe :NextPage = ( { data, preview }:InferGetStaticPropsType<typeof getStaticProps>  ) => {
   
  const { data: recipe } = usePreviewSubscription(recipeQuery, {
    params: { slug: data.recipe?.slug.current },
    initialData: data,
    enabled: preview,
  });
   
  const [likes, setLikes] = useState(data?.recipe?.likes);
   
   const handleLike = async () => {
      const res = await fetch("/api/handle-like", {
        method: "POST",
        body: JSON.stringify({ _id: recipe?._id }),
      })
      const data = await res.json();
      const {likes} = data.likes;
      
      setLikes(likes);
    };

   const router = useRouter();
   if (router.isFallback) {
      return (
         <h1>Loading...</h1>
      )
   }
  return (
    <article className='recipe'>
       <h1>{recipe?.name}</h1>
       <button onClick={ handleLike } className="like-button">{likes} Likes</button>
       <main className='content'>
         <Image src={ urlFor(data?.recipe?.mainImage).url() } alt={recipe?.name} width={400} height={400} />
         <div className='breackdown'>
            <ul className='ingredients'>
               {
                  recipe?.ingredient?.map( (ingredient: IngredientProp) => (
                     <li key={ingredient._key} className='ingredient' >
                        { ingredient?.wholeNumber  }
                        { ingredient?.fraction  }
                        { ingredient?.unit  }
                        <br />
                        { ingredient?.ingredient?.name  }
                     </li>

                  ))
               }
            </ul>
            <PortableText value={recipe?.instructions} className="instructions" />
         </div>
       </main>
    </article>
  )
}

export default Recipe;

export const getStaticPaths = async()=>{
   const paths = await sanityClient.fetch(
      `*[_type == "recipe" && defined(slug.current)]{
        "params": {
          "slug": slug.current
        }
      }`
    );
  
    return {
      paths,
      fallback: true,
    };
}

export const getStaticProps: GetStaticProps = async( { params }  )=>{
   const { slug }  = params as IParams;
   const recipe = await sanityClient.fetch( recipeQuery, { slug } );

   return { props: { data: { recipe }, preview: true } };


}