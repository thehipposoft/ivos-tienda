import Image from 'next/image'
import Link from 'next/link'

export const Footer = () => {
  return (
    <div id='contacto' className=' bg-brand-blue gap-16 flex flex-col'>
      <div className='w-[85vw] py-8 px-12 lg:px-8 gap-8 lg:gap-0 flex lg:flex-row flex-col justify-between lg:items-center border-b border-r border-[#F94E19] mx-auto'>
        <div className='flex flex-col gap-6'>
          <Image className='w-[220px] h-[90px] mx-auto md:mx-0' src={'/assets/images/logo-blanco.png'} alt='Logo IVOS blanco' width={558} height={237} />
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.7404858464733!2d-65.4106297!3d-24.7700855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc3d7c9590759%3A0x241c18ada1bffa66!2sIVOS%20-%20Revestimientos%20Alternativos!5e0!3m2!1sen!2smx!4v1743870234313!5m2!1sen!2smx" 
            width="350" 
            height="250"
            style={{border: '0'}}
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className='w-[85vw] md:w-[350px] h-[300px] md:h-[200px]'
          >
          </iframe>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex lg:justify-center items-center gap-2'>
            <div className='rounded-full bg-white w-12 h-12 flex justify-center items-center'>
              <svg width="18" height="21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 0c2.3869 0 4.6761.948211 6.364 2.63604C17.0518 4.32387 18 6.61305 18 9c0 3.074-1.676 5.59-3.442 7.395-.8823.8921-1.8451 1.7008-2.876 2.416l-.426.29-.2.133-.377.24-.336.205-.416.242c-.28237.1612-.60187.2459-.927.2459-.32513 0-.64463-.0847-.927-.2459l-.416-.242-.52-.32-.192-.125-.41-.273c-1.11217-.7525-2.1481-1.6119-3.093-2.566C1.676 14.589 0 12.074 0 9c0-2.38695.948211-4.67613 2.63604-6.36396C4.32387.948211 6.61305 0 9 0Zm0 6c-.39397 0-.78407.0776-1.14805.22836-.36398.15077-.69469.37174-.97327.65032-.27858.27858-.49955.60929-.65032.97327C6.0776 8.21593 6 8.60603 6 9c0 .39397.0776.78407.22836 1.1481.15077.3639.37174.6946.65032.9732.27858.2786.60929.4996.97327.6503C8.21593 11.9224 8.60603 12 9 12c.79565 0 1.5587-.3161 2.1213-.8787C11.6839 10.5587 12 9.79565 12 9c0-.79565-.3161-1.55871-.8787-2.12132C10.5587 6.31607 9.79565 6 9 6Z" fill="#F94E19"/></svg>
            </div>
            <p className='text-white'> Balcarce 1587, Salta Capital</p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-white w-12 h-12 flex justify-center items-center'>
              <svg width="19" height="19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.332 1.37891c.3868.10547.668.42187.668.80859C19 11.2227 11.6875 18.5 2.6875 18.5c-.42188 0-.73828-.2461-.84375-.6328L1 14.2109c-.070312-.3867.10547-.8086.49219-.9843l3.9375-1.6875c.35156-.1407.73828-.0352.98437.2461l1.75782 2.1445c2.74222-1.3008 4.95702-3.5508 6.22262-6.22267L12.25 5.94922c-.2812-.2461-.3867-.63281-.2461-.98438l1.6875-3.9375c.1758-.386715.5977-.597652.9844-.492184l3.6562.843754Z" fill="#F94E19"/></svg>
            </div>
            <Link className='text-white hover:underline' href={'tel:+543875296426'}>+54 9 387 529-6426</Link>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-white w-12 h-12 flex justify-center items-center'>
              <svg width="17" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9508.910156c1.1987 0 2.3482.476164 3.1958 1.323744.8476.84758 1.3237 1.99715 1.3237 3.19581V12.661c0 1.1987-.4761 2.3482-1.3237 3.1958-.8476.8476-1.9971 1.3238-3.1958 1.3238H4.71951c-1.19866 0-2.34823-.4762-3.19581-1.3238C.676117 15.0092.199951 13.8597.199951 12.661V5.42971c0-1.19866.476166-2.34823 1.323749-3.19581C2.37128 1.38632 3.52085.910156 4.71951.910156h7.23129ZM8.33515 5.42971c-.95893 0-1.87858.38093-2.55665 1.059-.67806.67806-1.05899 1.59772-1.05899 2.55664 0 .95895.38093 1.87855 1.05899 2.55665.67807.6781 1.59772 1.059 2.55665 1.059.95893 0 1.87855-.3809 2.55665-1.059.6781-.6781 1.059-1.5977 1.059-2.55665 0-.95892-.3809-1.87858-1.059-2.55664-.6781-.67807-1.59772-1.059-2.55665-1.059Zm0 1.80782c.47946 0 .93929.19047 1.27832.5295.33903.33903.52953.79886.52953 1.27832 0 .47947-.1905.93929-.52953 1.27835-.33903.339-.79886.5295-1.27832.5295-.47947 0-.93929-.1905-1.27832-.5295-.33904-.33906-.5295-.79888-.5295-1.27835 0-.47946.19046-.93929.5295-1.27832.33903-.33903.79885-.5295 1.27832-.5295Zm4.06755-3.16369c-.2397 0-.4696.09524-.6391.26475-.1695.16952-.2648.39943-.2648.63917 0 .23973.0953.46964.2648.63916.1695.16951.3994.26475.6391.26475.2398 0 .4697-.09524.6392-.26475.1695-.16952.2648-.39943.2648-.63916 0-.23974-.0953-.46965-.2648-.63917-.1695-.16951-.3994-.26475-.6392-.26475Z" fill="#F94E19"/></svg>
            </div>
            <Link href={'https://www.instagram.com/ivos.ok/'} target='_blank' rel='noopener noreferrer' className='text-white hover:underline'> @ivos.ok</Link>
          </div>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-white w-12 h-12 flex justify-center items-center'>
              <svg width={30} height={30} viewBox="0 0 24 24" fill="#F94E19" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 8L8.44992 11.6333C9.73295 12.4886 10.3745 12.9163 11.0678 13.0825C11.6806 13.2293 12.3194 13.2293 12.9322 13.0825C13.6255 12.9163 14.2671 12.4886 15.5501 11.6333L21 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>            </div>
            <Link className='text-white hover:underline' href={'mailto:ivos.argentina@gmail.com'}>ivos.argentina@gmail.com</Link>
          </div>
        </div>
      </div>
      <div className='md:w-[85vw] w-[90vw] mx-auto flex justify-center'>
        <Link href={'https://www.thehipposoft.com/'} target='_blank' className='text-white/50 md:text-lg py-5 hover:underline'>Created by <strong className='text-white'>HippoSoft</strong> | All Right Reserved</Link>
      </div>
    </div>
  )
}

export default Footer