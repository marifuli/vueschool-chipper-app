import { find, uniq, get } from 'lodash-es'

export const usePosts = defineStore('posts', () => {
    const { $api } = useNuxtApp()

    const posts = ref([])
    const isLoading = ref(false)

    async function fetchPosts () {
        isLoading.value = true
        try {
            const { data } = await $api.get('posts')
            posts.value = data
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            isLoading.value = false
        }
    }

    async function createPost (postData) {
        isLoading.value = true
        try {
            const response = await $api.post('posts', postData)
            // Add the new post to the posts array
            posts.value.unshift(response.data)
            return response
        } catch (error) {
            console.error('Error creating post:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return {
        posts,
        isLoading,
        fetchPosts,
        createPost
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}