<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const postsStore = usePosts()

// Fetch posts when the component is mounted
await postsStore.fetchPosts()
</script>

<template>
  <PostForm v-if="!user.isGuest" />
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
