<template>
    <ProcessDetail/>
</template>

<script>
import ProcessDetail from "@/components/ProcessDetail";
import {store} from '@/store'

export default {
    name: "ProcessDetailView",
    components: {
        ProcessDetail
    },
    mounted() {
        console.log(this.store.persondtc);
    },
    data() {
        return {
            store,
            currentProcessId: ""
        }
    }
}
</script>

<style scoped>

</style>
