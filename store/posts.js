// export const state = () => ({
//   loadedPosts: []
// })

// export const mutations = {
//   setPosts(state, posts) {
//     state.loadedPosts = posts
//   }
// }

// export const actions = {
//   nuxtServerInit(vuexContext, context) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         vuexContext.commit('setPosts', [
//             {
//               id: '1',
//               thumbnail: 'http://spice4life.co.za/wp-content/uploads/2015/03/Road.jpg',
//               title: 'This is My First Post',
//               previewText: 'this is preview text'
//             },
//             {
//               id: '2',
//               thumbnail: 'http://spice4life.co.za/wp-content/uploads/2015/03/Road.jpg',
//               title: 'This is My Second Post',
//               previewText: 'this is preview text'
//             },
//             {
//               id: '3',
//               thumbnail: 'http://spice4life.co.za/wp-content/uploads/2015/03/Road.jpg',
//               title: 'This is My Third Post',
//               previewText: 'this is preview text'
//             }
//           ])
//         resolve()
//       }, 1000) 
//     })
//   },
//   setPosts(vuexContext, posts) {
//     vuexContext.commit('setPosts', posts)
//   }
// }

// export const getters = {
//   loadedPosts(state) {
//     return state.loadedPosts
//   }
// }