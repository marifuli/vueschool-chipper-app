<script setup>
import useHelpers from '../composables/useHelpers'

const postsStore = usePosts()
const title = ref('')
const body = ref('')
const image = ref(null)
const imagePreview = ref('')
const isSubmitting = ref(false)
const { $api } = useNuxtApp()

function handleImageChange (event) {
  const file = event.target.files[0]
  if (file) {
    image.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function submit () {
  if (!title.value || !body.value) return

  isSubmitting.value = true
  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('body', body.value)
    if (image.value) {
      formData.append('image', image.value)
    }

    // Use the store's createPost method with FormData
    await postsStore.createPost(formData)

    // Clear the form after successful submission
    title.value = ''
    body.value = ''
    image.value = null
    imagePreview.value = ''
  } catch (error) {
    useHelpers().showErrorModal("Error", error?.message || error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="grid gap-4 mb-16" @submit.prevent="submit">
    <input v-model="title" placeholder="Post title"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base">
    <textarea v-model="body" placeholder="What is happening?!"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"></textarea>

    <!-- Image upload input -->
    <div class="grid gap-2">
      <label for="image-upload" class="flex items-center gap-2 cursor-pointer">
        <div class="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium">
          Attach Image
        </div>
        <span class="text-sm text-gray-500">{{ image ? image.name : 'No file selected' }}</span>
      </label>
      <input id="image-upload" type="file" accept="image/*" @change="handleImageChange" class="hidden">

      <!-- Image preview -->
      <div v-if="imagePreview" class="mt-2">
        <img :src="imagePreview" alt="Image preview" class="max-h-64 rounded-lg object-contain">
        <button type="button" @click="image = null; imagePreview = ''"
          class="mt-2 text-sm text-red-500 hover:text-red-700">
          Remove image
        </button>
      </div>
    </div>

    <button :disabled="isSubmitting" class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50">
      {{ isSubmitting ? 'Posting...' : 'Post' }}
    </button>
  </form>
</template>