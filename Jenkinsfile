pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        script {
          // Prefer npm ci in CI if package-lock.json exists
          if (isUnix()) {
            if (fileExists('package-lock.json')) {
              sh 'npm ci'
            } else {
              sh 'npm install'
            }
          } else {
            // Windows agents should have npm in PATH; fail with a clear message if not
            bat 'where npm || (echo npm not found in PATH && exit /b 1)'
            if (fileExists('package-lock.json')) {
              bat 'npm ci'
            } else {
              bat 'npm install'
            }
          }
        }
      }
    }

    stage('Test') {
      steps {
        script {
          if (isUnix()) {
            sh 'npm test --silent'
          } else {
            bat 'npm test --silent'
          }
        }
      }
    }

    stage('Build (optional)') {
      when {
        expression { return env.BUILD_DOCKER == 'true' }
      }
      steps {
        script {
          // Build a local Docker image; pushing requires credentials and additional setup
          if (isUnix()) {
            sh 'docker build -t ${JOB_NAME}:${BUILD_NUMBER} .'
          } else {
            bat 'docker build -t %JOB_NAME%:%BUILD_NUMBER% .'
          }
        }
      }
    }
  }

  post {
    always {
      // Collect JUnit results if present; allowEmptyResults prevents failures when no report is generated
      junit testResults: '**/test-results/*.xml', allowEmptyResults: true
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
      echo "Build status: ${currentBuild.currentResult}"
    }
    failure {
      script {
        // Only attempt to send email if MAIL_TO is configured in the environment
        if (env.MAIL_TO) {
          try {
            mail to: env.MAIL_TO, subject: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}", body: "See Jenkins console output: ${env.BUILD_URL}"
          } catch (e) {
            echo "Mail failed to send: ${e}"
          }
        } else {
          echo 'MAIL_TO not configured; skipping failure email.'
        }
      }
    }
  }
}
