import {
    FacebookShareButton,
    FacebookIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    LineShareButton,
    LineIcon,
    PinterestShareButton,
    PinterestIcon,
    RedditShareButton,
    RedditIcon,
    TelegramShareButton,
    TelegramIcon,
    EmailShareButton,
    EmailIcon,
  } from 'next-share'
  import React from 'react'
  
  const Share = () => {
    return (
      <div className='w-[100vw] flex flex-wrap flex-row item-center justify-center customSharing'>
        <FacebookShareButton
            url={'https://github.com/next-share'}
            quote={'next-share is a social share buttons for your next React apps.'}
            hashtag={'#nextshare'}>
            <FacebookIcon size={32} round />
        </FacebookShareButton>
        <FacebookMessengerShareButton
            url={'https://github.com/next-share'}
            appId={''}>
        <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
        <PinterestShareButton
            url={'https://github.com/next-share'}
            media={'next-share is a social share buttons for your next React apps.'}>
        <PinterestIcon size={32} round />
        </PinterestShareButton>
        <RedditShareButton
            url={'https://github.com/next-share'}
            title={'next-share is a social share buttons for your next React apps.'}>
        <RedditIcon size={32} round />
        </RedditShareButton>
        <TelegramShareButton
            url={'https://github.com/next-share'}
            title={'next-share is a social share buttons for your next React apps.'}>
        <TelegramIcon size={32} round />
        </TelegramShareButton>
        <EmailShareButton
            url={'https://github.com/next-share'}
            subject={'Next Share'}
            body="body">
        <EmailIcon size={32} round />
        </EmailShareButton>
        <LineShareButton
            url={'https://github.com/next-share'}>
        <LineIcon size={32} round/>
        </LineShareButton>
      </div>
    )
  }
  
  export default Share
