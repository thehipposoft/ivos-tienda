import InstagramFeed from './InstagramFeed'
import { FeedData } from '@/types/instagram'
import Image from 'next/image'
import Link from 'next/link'

const RedesSociales = ({feedData}:FeedData) => {
  return (
    <div className='relative py-12' id='redes-sociales'>
        <div className='flex flex-col w-[85vw] 2xl:w-[1300px] mx-auto gap-8 relative z-10'>
            <div className='flex  lg:flex-row flex-col justify-between'>
              <h4 className='uppercase font-bold text-4xl'>¡Seguinos en nuestras redes!</h4>
              <Link href={'https://www.instagram.com/ivos.ok/'} target='_blank' className='flex w-fit gap-2 items-center group duration-300 hover:scale-110'>
                  <svg width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.9954 11.3309c-3.1215 0-5.6689 2.5475-5.6689 5.6691 0 3.1216 2.5474 5.6691 5.6689 5.6691 3.1216 0 5.669-2.5475 5.669-5.6691 0-3.1216-2.5474-5.6691-5.669-5.6691ZM33.9981 17c0-2.3476.0213-4.6739-.1106-7.01724-.1318-2.72184-.7527-5.13747-2.743-7.12782C29.1499.860345 26.7386.243679 24.0168.11184 21.6693-.0199994 19.343.001265 16.9997.001265c-2.3476 0-4.6738-.0212644-7.01713.110575-2.72178.131839-5.13737.752758-7.12768 2.7431C.86033 4.84954.243674 7.26092.111838 9.98276-.0199991 12.3303.001265 14.6567.001265 17s-.0212641 4.6739.110573 7.0172c.131836 2.7219.752744 5.1375 2.743052 7.1279 1.99456 1.9946 4.4059 2.6112 7.12768 2.7431 2.34753.1318 4.67383.1105 7.01713.1105 2.3475 0 4.6738.0213 7.0171-.1105 2.7218-.1319 5.1374-.7528 7.1277-2.7431 1.9945-1.9946 2.6112-4.406 2.743-7.1279.1361-2.3433.1106-4.6696.1106-7.0172Zm-17.0027 8.7226c-4.8269 0-8.72245-3.8956-8.72245-8.7226s3.89555-8.72264 8.72245-8.72264c4.827 0 8.7225 3.89564 8.7225 8.72264s-3.8955 8.7226-8.7225 8.7226Zm9.0797-15.76536c-1.1269 0-2.037-.91011-2.037-2.03713 0-1.12701.9101-2.03712 2.037-2.03712 1.127 0 2.0371.91011 2.0371 2.03712.0004.26762-.0521.53267-.1543.77998-.1023.2473-.2523.47201-.4416.66124-.1892.18923-.4139.33927-.6612.44153-.2473.10225-.5123.15472-.78.15438Z" fill="#01222C"/></svg>
              </Link>
            </div>

            <InstagramFeed feedData={feedData} />
        </div>
        <Image src={'/assets/images/redes-bg.png'} alt='Fondo logo IVOS' fill className='object-cover' />
        <div className='w-full h-full absolute left-0 top-0 bg-white/80' />
    </div>
  )
}

export default RedesSociales