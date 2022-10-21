<template>
  <h1>{{ $t('home.title') }}</h1>
  <div>
    <p>{{ $t('home.instructions_1') }}</p>
    <p>{{ $t('home.instructions_2') }}</p>
    <p>{{ $t('home.instructions_3') }} <a :href="$t('home.legal_notice_url')">{{ $t('home.legal_notice') }}</a></p>
  </div>
</template>
