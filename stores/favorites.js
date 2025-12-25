import { find, uniq, get } from 'lodash-es'

export const useFavorites = defineStore('favorites', () => {
    const { $api } = useNuxtApp()

    const favoritePosts = ref([])
    const favoriteUsers = ref([])
    const isLoading = ref(false)

    async function fetchFavorites () {
        isLoading.value = true
        try {
            const { data } = await $api.get('favorites')
            favoritePosts.value = data.posts || []
            favoriteUsers.value = data.users || []
        } catch (error) {
            console.error('Error fetching favorites:', error)
        } finally {
            isLoading.value = false
        }
    }

    async function addFavoriteUser (userId) {
        try {
            await $api.post(`users/${userId}/favorite`)
            // Fetch updated favorites after adding
            await fetchFavorites()
        } catch (error) {
            console.error('Error adding favorite user:', error)
            throw error
        }
    }

    async function removeFavoriteUser (userId) {
        try {
            await $api.delete(`users/${userId}/favorite`)
            // Fetch updated favorites after removing
            await fetchFavorites()
        } catch (error) {
            console.error('Error removing favorite user:', error)
            throw error
        }
    }

    function isUserFavorite (userId) {
        return favoriteUsers.value.some(user => user.id === userId)
    }

    async function addFavoritePost (postId) {
        try {
            await $api.post(`posts/${postId}/favorite`)
            // Fetch updated favorites after adding
            await fetchFavorites()
        } catch (error) {
            console.error('Error adding favorite post:', error)
            throw error
        }
    }

    async function removeFavoritePost (postId) {
        try {
            await $api.delete(`posts/${postId}/favorite`)
            // Fetch updated favorites after removing
            await fetchFavorites()
        } catch (error) {
            console.error('Error removing favorite post:', error)
            throw error
        }
    }

    function isPostFavorite (postId) {
        return favoritePosts.value.some(post => post.id === postId)
    }

    return {
        favoritePosts,
        favoriteUsers,
        isLoading,
        fetchFavorites,
        addFavoriteUser,
        removeFavoriteUser,
        isUserFavorite,
        addFavoritePost,removeFavoritePost,
        isPostFavorite,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}