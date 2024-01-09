import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tweets = localStorage.getItem('tweets')? 
                JSON.parse(localStorage.getItem('tweets')) :
                tweetsData

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyinput){
        handleReplyBtnClick(e.target.dataset.replyinput)
    }
    else if(e.target.dataset.trash){
        handleTrashClick(e.target.dataset.trash)
    }
    else if(e.target.id === 'darkmode'){
        toggleMode()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweets.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isUser: true,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleReplyBtnClick(replyId){
    const targetObject = tweets.filter(function(tweet){
        return tweet.uuid === replyId
    })[0]
    const replyInput = document.getElementById(`reply-input-${replyId}`)
    if(replyInput.value){
        targetObject.replies.push({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: `${replyInput.value}`,
        })
    }
    render()
    replyInput.value = ''
}

function handleTrashClick(trashId){
    const filteredTweets = tweets.filter(function(tweet){
        return tweet.uuid != trashId
    })
    tweets.length = 0
    tweets.push(...filteredTweets)
    render()
    
}

function toggleMode(){
    document.getElementById('body').classList.toggle('dark-mode')
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweets.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let trashIconClass = ''
        
        if (!tweet.isUser){
            trashIconClass = 'hidden'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail ${trashIconClass}">
                    <i class="fa-solid fa-trash " data-trash="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class="reply-inner">
        <textarea placeholder="Post your reply" class="tweet-reply" id="reply-input-${tweet.uuid}"></textarea>
        <button id="reply-btn" data-replyinput=${tweet.uuid}>Reply</button>
        </div>
        
    </div>   
</div>
`
   })
   
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    localStorage.setItem('tweets', JSON.stringify(tweets))
}

render()

