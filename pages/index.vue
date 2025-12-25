<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const postsStore = usePosts()
const favoritesStore = useFavorites()

// Fetch posts and favorites when the component is mounted
await Promise.all([
  postsStore.fetchPosts(),
  favoritesStore.fetchFavorites()
])

// Start checking for new posts every 30 seconds
onMounted(() => {
  postsStore.startAutoCheck(30000)
})

// Clean up when component is unmounted
onUnmounted(() => {
  postsStore.stopAutoCheck()
})

function loadNewPosts () {
  postsStore.loadNewPosts()
}
</script>

<template>
  <PostForm v-if="!user.isGuest" />

  <!-- New Posts Button -->
  <div v-if="postsStore.hasNewPosts" class="mb-8">
    <button @click="loadNewPosts"
      class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
      <span>Load New Posts ({{ postsStore.newPosts.length }})</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <div v-if="postsStore.isLoading" class="text-center py-8">
    Loading posts...
  </div>
  <div v-else class="grid gap-16">
    <PostItem v-for="post in postsStore.posts" :key="post.id" v-bind="{ post }" />
    <p v-if="postsStore.posts.length === 0" class="text-center text-gray-500">
      No posts yet. Be the first to post!
    </p>
  </div>
</template>
