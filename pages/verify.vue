<script lang="ts" setup>

const route = useRoute();
const router = useRouter();
const params = route.params;
const token = ref('');
const uid = ref('');
if (!params.token || !params.uid) {
    console.log("Could not verify user");
    router.push('/');
} else {
    const { token: t, uid: u } = params;
    console.log({ t, u })
    token.value = t as string;
    uid.value = u as string;
}
</script>

<template>
    Hello
    <br>
    TOKEN: {{ token }}
    <br>
    UID: {{ uid }}
</template>