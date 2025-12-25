<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'
import useHelpers from '../composables/useHelpers'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const favoritesStore = useFavorites()
const user = useUser()
const isPostLoading = ref(false)
const isUserLoading = ref(false)

// Check if the post author is in the user's favorites
const isFavoriteUser = computed(() => {
  return favoritesStore.isUserFavorite(props.post.user.id)
})
const isFavoritePost = computed(() => {
  return favoritesStore.isPostFavorite(props.post.id)
})

function isLoggedIn() {
  if(!user.data?.id) {
    useHelpers().showErrorModal("Error", "Please login to follow or save to favorites!")
    return false 
  }
  return true 
}

async function toggleFavoriteUser () {
  if (isUserLoading.value || !isLoggedIn()) return

  isUserLoading.value = true
  try {
    if (isFavoriteUser.value) {
      await favoritesStore.removeFavoriteUser(props.post.user.id)
    } else {
      await favoritesStore.addFavoriteUser(props.post.user.id)
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  } finally {
    isUserLoading.value = false
  }
}
async function toggleFavoritePost () {
  if (isPostLoading.value || !isLoggedIn()) return

  isPostLoading.value = true
  try {
    if (isFavoritePost.value) {
      await favoritesStore.removeFavoritePost(props.post.id)
    } else {
      await favoritesStore.addFavoritePost(props.post.id)
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  } finally {
    isPostLoading.value = false
  }
}
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div >
        by <strong>{{ post.user.name }}</strong>
      </div>
      <button v-if="post.user.id !== user.data?.id" 
        @click="toggleFavoriteUser" :disabled="isUserLoading" 
        :class="[
          'font-medium text-sm px-2 rounded-full',
          isFavoriteUser ? 'bg-green-200' : 'bg-blue-200',
          isUserLoading ? 'opacity-50' : ''
        ]"
      >
        {{ isUserLoading ? 'Loading...' : (isFavoriteUser ? 'Unfollow' : 'Follow') }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button @click="toggleFavoritePost" :disabled="isPostLoading" class="flex items-center justify-center gap-2 p-4 rounded-lg"
      :class="[
        isFavoritePost ? 'bg-red-300 text-red-600' : 'bg-red-200 text-red-500',
        isPostLoading ? 'opacity-50' : ''
      ]">
      <HeartIcon class="h-6 stroke-current" />
      <span class="font-bold">
        {{ isPostLoading ? 'Loading...' : (isFavoritePost ? 'Remove from favorites' : 'Add to my favorites') }}
      </span>
    </button>
  </div>
</template>