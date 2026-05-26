<template>
  <div class="form-page">
    <el-card shadow="hover">
      <template #header>
        <el-tabs v-model="formType" @tab-change="handleReset">
          <el-tab-pane :label="t('basicForm')" name="basic" />
          <el-tab-pane :label="t('stepForm')" name="step" />
        </el-tabs>
      </template>

      <!-- 基础表单 -->
      <div v-if="formType === 'basic'">
        <el-form ref="basicRef" :model="basic" :rules="basicRules" label-width="110px" style="max-width: 640px">
          <el-form-item :label="t('activityName')" prop="name">
            <el-input v-model="basic.name" :placeholder="t('activityName')" />
          </el-form-item>
          <el-form-item :label="t('activityRegion')" prop="region">
            <el-select v-model="basic.region" :placeholder="t('activityRegion')" style="width: 100%">
              <el-option :label="t('regionShanghai')" value="shanghai" />
              <el-option :label="t('regionBeijing')" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('activityTime')">
            <el-date-picker v-model="basic.date" type="daterange" :range-separator="'至'" :start-placeholder="t('activityTime')" :end-placeholder="t('activityTime')" style="width: 100%" />
          </el-form-item>
          <el-form-item :label="t('instantDelivery')">
            <el-switch v-model="basic.delivery" />
          </el-form-item>
          <el-form-item :label="t('activityType')">
            <el-checkbox-group v-model="basic.type">
              <el-checkbox :label="t('food')" />
              <el-checkbox :label="t('sports')" />
              <el-checkbox :label="t('music')" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="t('activityDesc')">
            <el-input v-model="basic.desc" type="textarea" :rows="4" :placeholder="t('activityDesc')" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleBasicSubmit">{{ t('submit') }}</el-button>
            <el-button @click="handleReset">{{ t('reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 分步表单 -->
      <div v-else>
        <el-steps :active="step" finish-status="success" align-center style="max-width: 600px; margin: 0 auto 32px">
          <el-step :title="t('stepBasicInfo')" />
          <el-step :title="t('stepDetailInfo')" />
          <el-step :title="t('stepConfirmInfo')" />
        </el-steps>

        <!-- Step 1 -->
        <div v-show="step === 0" style="max-width: 500px; margin: 0 auto">
          <el-form ref="step1Ref" :model="stepForm" :rules="step1Rules" label-width="100px">
            <el-form-item :label="t('activityName')" prop="name">
              <el-input v-model="stepForm.name" />
            </el-form-item>
            <el-form-item :label="t('activityRegion')" prop="region">
              <el-select v-model="stepForm.region" style="width: 100%">
                <el-option :label="t('regionShanghai')" value="shanghai" />
                <el-option :label="t('regionBeijing')" value="beijing" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- Step 2 -->
        <div v-show="step === 1" style="max-width: 500px; margin: 0 auto">
          <el-form ref="step2Ref" :model="stepForm" :rules="step2Rules" label-width="100px">
            <el-form-item :label="t('instantDelivery')" prop="delivery">
              <el-switch v-model="stepForm.delivery" />
            </el-form-item>
            <el-form-item :label="t('activityTime')">
              <el-date-picker v-model="stepForm.date" type="date" style="width: 100%" />
            </el-form-item>
            <el-form-item :label="t('activityType')">
              <el-checkbox-group v-model="stepForm.type">
                <el-checkbox :label="t('food')" />
                <el-checkbox :label="t('sports')" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>

        <!-- Step 3 -->
        <div v-show="step === 2" style="max-width: 500px; margin: 0 auto">
          <el-descriptions :column="1" border>
            <el-descriptions-item :label="t('activityName')">{{ stepForm.name }}</el-descriptions-item>
            <el-descriptions-item :label="t('activityRegion')">{{ stepForm.region === 'shanghai' ? t('regionShanghai') : t('regionBeijing') }}</el-descriptions-item>
            <el-descriptions-item :label="t('instantDelivery')">{{ stepForm.delivery ? t('enabled') : t('disabled') }}</el-descriptions-item>
            <el-descriptions-item :label="t('activityType')">{{ stepForm.type.join(', ') }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div style="text-align: center; margin-top: 24px">
          <el-button v-if="step > 0" @click="step--">{{ t('prevStep') }}</el-button>
          <el-button v-if="step < 2" type="primary" @click="handleNext">{{ t('nextStep') }}</el-button>
          <el-button v-if="step === 2" type="primary" @click="handleStepSubmit">{{ t('submit') }}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/locales'

const { t } = useI18n()

const formType = ref('basic')
const step = ref(0)

const basicRef = ref<FormInstance>()
const step1Ref = ref<FormInstance>()
const step2Ref = ref<FormInstance>()

const basic = reactive({ name: '', region: '', date: '', delivery: false, type: [] as string[], desc: '' })

const basicRules: FormRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
}

const stepForm = reactive({ name: '', region: '', delivery: false, date: '', type: [] as string[] })

const step1Rules: FormRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  region: [{ required: true, message: '请选择区域', trigger: 'change' }],
}
const step2Rules: FormRules = {}

function handleBasicSubmit() {
  basicRef.value?.validate((valid) => {
    if (valid) { ElMessage.success(t('submitSuccess')); console.log(basic) }
  })
}

function handleReset() {
  basicRef.value?.resetFields()
  step1Ref.value?.resetFields()
  step2Ref.value?.resetFields()
  step.value = 0
}

function handleNext() {
  const ref = step.value === 0 ? step1Ref : step2Ref
  ref.value?.validate((valid) => {
    if (valid) step.value++
  })
}

function handleStepSubmit() {
  ElMessage.success(t('submitSuccess'))
  step.value = 0
}
</script>
