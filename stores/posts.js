import { find, uniq, get } from 'lodash-es'

export const usePosts = defineStore('posts', () => {
    const { $api } = useNuxtApp()

    const posts = ref([])
    const newPosts = ref([])
    const isLoading = ref(false)
    const isCheckingNewPosts = ref(false)
    const hasNewPosts = computed(() => newPosts.value.length > 0)
    let checkInterval = null

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

    async function checkForNewPosts () {
        if (isCheckingNewPosts.value) return

        isCheckingNewPosts.value = true
        try {
            const { data } = await $api.get('posts')

            // If we don't have any posts yet, just set them directly
            if (posts.value.length === 0) {
                posts.value = data
                newPosts.value = []
                return
            }

            // Find posts that aren't in our current list
            // We're using post IDs to compare
            const currentPostIds = posts.value.map(post => post.id)
            const freshPosts = data.filter(post => !currentPostIds.includes(post.id))

            // Update newPosts with any fresh posts
            if (freshPosts.length > 0) {
                newPosts.value = freshPosts
            }
        } catch (error) {
            console.error('Error checking for new posts:', error)
        } finally {
            isCheckingNewPosts.value = false
        }
    }

    function loadNewPosts () {
        // Add new posts to the beginning of the posts array
        posts.value = [...newPosts.value, ...posts.value]
        // Clear the new posts array
        newPosts.value = []
    }

    function startAutoCheck (intervalMs = 30000) {
        // Clear any existing interval
        if (checkInterval) {
            clearInterval(checkInterval)
        }

        // Set up a new interval
        checkInterval = setInterval(() => {
            checkForNewPosts()
        }, intervalMs)

        // Initial check
        checkForNewPosts()
    }

    function stopAutoCheck () {
        if (checkInterval) {
            clearInterval(checkInterval)
            checkInterval = null
        }
    }

    // Clean up interval when the store is no longer used
    onUnmounted(() => {
        stopAutoCheck()
    })

    return {
        posts,
        newPosts,
        isLoading,
        isCheckingNewPosts,
        hasNewPosts,
        fetchPosts,
        createPost,
        checkForNewPosts,
        loadNewPosts,
        startAutoCheck,
        stopAutoCheck
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}