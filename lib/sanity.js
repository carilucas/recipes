import { createClient, createPreviewSubscriptionHook } from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url';
import { PortableText as PortableTextComponent } from '@portabletext/react'
import {config} from './config'


export const sanityClient = createClient( config );

export const usePreviewSubscription = createPreviewSubscriptionHook(config);
export const urlFor = (source)=>createImageUrlBuilder(config).image(source);

export const PortableText = (props) => <PortableTextComponent components={{}} {...props} />