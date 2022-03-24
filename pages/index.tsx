import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css';
import { sanityClient, urlFor } from '../lib/sanity';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type QueryProps = {
  name: string
  _id: string
  slug:{
    current:string,
    _type:string
  }
  mainImage:{
    asset:{
      _ref:string,
      _type:string
    }
  }
  
}


const recipesQuery = `*[_type=="recipe"]{
  _id,
  name,
  mainImage,
  slug
}`;

const Home:NextPage = ( {recipes}:InferGetStaticPropsType<typeof getStaticProps> ) => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Qarilucas recipes</title>
        <meta name="description" content="Recipes for every day" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Wellcome to the Qarilucas Recipes</h1>
      <ul className='recipes-list'>
        {
          recipes?.length > 0 && recipes.map( (recipe: QueryProps) => (
            <li key={recipe._id} className='recipe-card'>
              <Link href={`/recipes/${recipe.slug.current}`}>
                <a> 
                  <Image src={ urlFor(recipe.mainImage).url() } alt={recipe.name} width={400} height={400} />
                  <span>{recipe.name}</span>
                </a>
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Home;

export const getStaticProps: GetStaticProps  = async()=>{

  const recipes:QueryProps[] = await sanityClient.fetch( recipesQuery );

  return{
    props:{
      recipes
    }
  }
}
