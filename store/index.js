// import axios from 'axios'
import Cookie from 'js-cookie'

export const state = () => ({
  loadedPosts: [],
  token: null
})

export const mutations = {
  setPosts(state, posts) {
    state.loadedPosts = posts
  },
  addPost(state, post) {
    state.loadedPosts.push(post)
  },
  editPost(state, editedPost) {
    const postIndex = state.loadedPosts.findIndex(
      post => post.id === editedPost.id
    )
    state.loadedPosts[postIndex] = editedPost
  },
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null
  }
}

export const actions = {
  nuxtServerInit(vuexContext, context) {
    return context.app.$axios
      .$get('/posts.json')
      .then(data => {
        const postsArray = []
        for (const key in data) {
          postsArray.push({ ...data[key], id: key})
        }
        vuexContext.commit('setPosts', postsArray)
      })
      .catch(e => context.error(e))
  },
  addPost(vuexContext, post) {
    const createdPost = {
      ...post, 
      updatedDate: new Date()
    }
    return this.$axios
      .$post("/posts.json?auth=" + vuexContext.state.token, createdPost)
      .then(data => {
        vuexContext.commit('addPost', {...createdPost, id: data.name})
      })
      .catch(e => console.log(e)) 
  },
  editPost(vuexContext, editedPost) {
    return this.$axios
      .$put(
        "/posts/" + editedPost.id + ".json?auth=" + vuexContext.state.token, 
        editedPost)
      .then(res => {
        vuexContext.commit('editPost', editedPost)
      })
      .catch(e => console.log(e))
  },
  setPosts(vuexContext, posts) {
    vuexContext.commit('setPosts', posts)
  },
  authenticateUser(vuexContext, authData) {
     // set login url variable
     let authURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' 

     // change authURL to signup url if in signup mode
     if (!authData.isLogin) {
       authURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key='
     }

     // send weather login or sign up to firebase authentication
     return this.$axios
      .$post(authURL + process.env.fbAPIKey, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
      })
      .then(result => {
        vuexContext.commit('setToken', result.idToken)
        localStorage.setItem('token', result.idToken)
        localStorage.setItem(
          'tokenExpiration', 
          new Date().getTime() + +result.expiresIn * 1000
        )
        Cookie.set('jwt', result.idToken)
        Cookie.set(
          'expirationDate', 
          new Date().getTime() + +result.expiresIn * 1000
        )
        // return this.$axios.$post('http://localhost:3000/api/track-data', {data: 'Authenticated!'})
        // vuexContext.dispatch('setLogoutTimer', result.expiresIn * 1000)
      })
      .catch(e => console.log(e))
  },
  // setLogoutTimer(vuexContext, duration) {
  //   setTimeout(() => {
  //     vuexContext.commit('clearToken')
  //   }, duration)
  // },
  initAuth(vuexContext, req) {
    let token
    let expirationDate

    if (req) {
      if (!req.headers.cooke) {
        return
      }
      const jwtCookie = req.headers.cooke
        .split(';')
        .find(c => c.trim().startWtih('jwt='))
      
      if (!jwtCookie) {
        return
      }
      token = jwtCookie.split('=')[1]
      expirationDate = req.headers.cooke
        .split(";")
        .find(c => c.trim().startWtih('expirationDate='))
        .split("=")[1]
    } else if (process.client) {
      token = localStorage.getItem("token")
      expirationDate = localStorage.getItem("tokenExpiration")
    }    
    // console.log(new Date().getTime(), +expirationDate)
    if (new Date().getTime() > +expirationDate || !token) {
      console.log('no Token')
      vuexContext.commit('clearToken')
      return
    }
    vuexContext.commit('setToken', token)
  },
  logout(vuexContext) {
    vuexContext.commit('clearToken')
    Cookie.remove('jwt')
    Cookie.remove('expirationDate')
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration ')
    }
  }
}

export const getters = {
  loadedPosts(state) {
    return state.loadedPosts
  },
  isAuthenticated(state) {
    return state.token != null
  }
}







// export const state = () => {}
// export const mutations = () => {}
// export const actions = () => {}
// export const getters = () => {}







// import Vuex from 'vuex'

// const createStore = () => {
//   return new Vuex.Store({
//     state: {
//       loadedPosts: [],
//       text: 'Hello World'
//     },
//     mutations: {
//       setPosts(state, posts) {
//         state.loadedPosts = posts
//       }
//     },
//     actions: {
//       nuxtServerInit(vuexContext, context) {
//         return new Promise((resolve, reject) => {
//           setTimeout(() => {
//             vuexContext.commit('setPosts', [
//                 {
//                   id: '1',
//                   thumbnail: 'http://spice4life.co.za/wp-content/uploads/2015/03/Road.jpg',
//                   title: 'This is My First Post',
//                   previewText: 'this is preview text'
//                 },
//                 {
//                   id: '2',
//                   thumbnail: 'http://spice4life.co.za/wp-content/uploads/2015/03/Road.jpg',
//                   title: 'This is My Second Post',
//                   previewText: 'this is preview text'
//                 },
//                 {
//                   id: '3',
//                   thumbnail: 'http://spice4life.co.za/wp-content/uploads/2015/03/Road.jpg',
//                   title: 'This is My Third Post',
//                   previewText: 'this is preview text'
//                 }
//               ])
//             resolve()
//           }, 1000) 
//         })
//       },
//       setPosts(vuexContext, posts) {
//         vuexContext.commit('setPosts', posts)
//       }
//     },
//     getters: {
//       loadedPosts(state) {
//         return state.loadedPosts
//       }
//     }
//   })
// }

// export default createStore