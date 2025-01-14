# Veracode Pipeline Scan Action

Veracode Pipeline Scan Action runs the Veracode pipeline scan as an action on any GitHub pipleine

The only pre-requisites is to have the application compiled/packaged according the Veracode Packaging Instructions [here](https://docs.veracode.com/r/compilation_packaging) 

## About

The `pipeline-scan action` is designed to be used in a CI/CD pipeline to submit a binary or source code zip to Veracode for security scanning. It supports scans for Java, JavaScript, Scala, Kotlin, Groovy and Android code.

For more information on Pipeline Scan visit Veracode Help Center Page: https://help.veracode.com/reader/tS9CaFwL4_lbIEWWomsJoA/ovfZGgu96UINQxIuTqRDwg

## Usage

Intended usage is to add a job to your CI/CD pipeline, after a build job, uploads the "application", scans it and returns the results.  
A build can be failed upon findings, as well the action allows you to generate a new baseline file and commit it back into a different branch of yyour repository where it can be used to sort out previous findings in order to report on net new findings. Please refere to the Veracode documentation [here](https://docs.veracode.com/r/Using_a_Pipeline_Scan_Baseline_File).  
  
If the action will run within a PR, it will automatically add a comment with all results to the PR. This is done for easy review and approval processes. 

The tool will need some information passed to it as command line arguments (many are optional):

* Required
  * vid
    * the Veracode API ID
  * vkey
    * the Veracode API Secret Key
  * file
    * The build artifact file to upload and scan

* Very Common
  * request_policy
    * The name of the custom platform policy that will be downloaded. A scan will not happen. This can not be a Veracode builtin policy. The name of the policy file is by convention the name of the policy with spaces replaced by underscores and .json appended.
  * fail_on_severity
    * Only fail if flaws of Very High or High severity are found.
  * fail_on_cwe
    * Also fail if a CWE-80: (XSS) flaw is found. (It is Medium severity and thus would be filtered out by the above option)
  * request_policy
    * Specify the name of a Policy on the Veracode platform that will be downlaoded and use to rate pipeline scan findings on
  * policy_name
    * Name of the Veracode default policy rule to apply to the scan results. You can only use this parameter with a Veracode default policy.
  * policy_file

* Common
  * timeout
  * issue_details
  * summary_display
  * json_display
  * verbose
  * summary_output
  * summary_output_file
  * json_output
  * json_output_file
  * filtered_json_output_file
  * project_name
  * project_url
  * project_ref
  * app_id
  * development_stage

* Baseline file
  * if a baseline file should be stored from the scan all paramters are required
  * store_baseline_file
    * TRUE | FALES
  * store_baseline_file_branch:
    * Enter the branch name where the baseline file should be stored
  * create_baseline_from:
    * From which results should the baseline file be created. standard = full results || filtered = filtered results
  * fail_build:
    * Fail the build upon findings. Takes true or false


## Examples

### Generic

To use the pipeline scan:
1.  Include the JAR file you downloaded from **pipeline-scan-LATEST.zip**.
2.  After a build stage, add a stage that runs the Pipeline Scan JAR using java -jar, and passes the relevant [command parameters](https://help.veracode.com/reader/tS9CaFwL4_lbIEWWomsJoA/zjaZE08bAYZVPBWWbgmZvw).

### GitLab & Gradle
If the pipeline scan finds any flaws, it returns status code >=1 (greater than or equal to 1), indicating the number of flaws found, and fails the Pipeline Scan stage. The exit code will report the number of flaws (up to 200). If you include the **--fail_on_severity** or the **--fail_on_cwe parameter**, the pipeline scan counts only flaws matching the defined failure parameters.
Note: Veracode recommends that you download **pipeline-scan-LATEST.zip** each time a job is run, to ensure that you are using the latest version of pipeline scan. Alternatively, cache this file locally on your CI system and download it at a regular interval.  All examples provided include a step of downloading and extracting the latest pipeline scan distributable.

Here are some common scenarios of how you may wish to configure Pipeline Scan to initiate scans.  All are based on setting up Pipeline Scan as a step after the application has been built:

#### Report policy-violating flaws, but proceed regardless of the results
1.  Initiate Pipeline Scan on the built application, defining the policy criteria with the "-fs" and "-fc" parameters
2.  After the Pipeline Scan stage runs, proceed to the next stage, ignoring any exit code from the Pipeline Scan stage
    *  This is sometimes called "Allow Failure"; implementation details vary for each CI system

#### Fail the pipeline stage (aka "Break the Build") if any policy violating flaws are found
1.  Initiate Pipeline Scan on the built application, defining the policy criteria with the "-fs" and "-fc" parameters
2.  The Pipeline Scan stage will fail if any flaws matching the defined criteria are found
    *  The number of flaws (up to 200) is reported by the exit code
3.  The Pipeline Scan stage will pass if no flaws matching the defined criteria are found.

#### Fail the pipeline stage (aka "Break the Build") if any newly-identified policy violating flaws are found
1.  Include a scan baseline file either as an artifact from a prior build, or from the project repository, defining the existing set of known flaws
2.  Initiate Pipeline Scan on the built application, defining the policy criteria with the "-fs" and "-fc" parameters and including the baseline file with the "-bf" parameter
3.  The Pipeline Scan stage will fail if any flaws matching the defined criteria are found that are not present in the baseline file 
    *  The number of flaws (up to 200) is reported by the exit code
4.  The Pipeline Scan stage will pass if no flaws are found that match the defined criteria, or if all the flaws found are present in the baseline file

You can use a baseline file to establish a baseline set of scan results. The pipeline scan evaluates only flaws that differ from those in the baseline file to determine pass or fail criteria. You can use a baseline file to evaluate security risk on only new changes to your application.

### GitLab

Pipeline scan can be added as a job in a [GitLab Pipeline](https://docs.gitlab.com/ee/ci/pipelines/).  GitLab Pipeline jobs are configured by means of YAML configuration files.  The YAML code below provide examples of how to configure a pipeline to build a project and run Pipeline Scan as a stage in the pipeline.

#### GitLab Integrations

In order to automatically generate GitLab vulnerabilities, the GitLab repository must have a GitLab Gold / Ultimate license. In order to automatically generate GitLab issues, no premium GitLab subscriptions are needed. An API access token for the GitLab repository must be generated and set as a variable in the CI/CD settings with the key `PRIVATE_TOKEN`.

Before running a Pipeline Scan of a Java application using the --gl_issue_generation parameter to generate GitLab issues, you must define environment variables for the filepaths of the base directories.

In your GitLab environment:

* Set these environment variables:
* * SRC_ROOT: the filepath typically is /src/main/java/.
* * JSP_ROOT: the filepath typically is /src/main/webapp/.

#### GitLab & Gradle (with automatic vulnerability generation)

We use this structure in GitLab CI to self-test, setting the `$VERACODE_API_*` variables in the CI/CD Settings.

```yml
# image must have JDK8+, gradle, curl, unzip
image: <image-with-above-requirements>

stages:
  - build
  - scan

build_job:
  stage: build
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_build
    paths:
      - build/
    expire_in: 1 week
  script: gradle clean build

pipeline scan:
  stage: scan
  dependencies:
    - build_job
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_pipeline-results
    paths:
      - results.json
      - veracode_gitlab_vulnerabilities.json
    reports: 
      sast: veracode_gitlab_vulnerabilities.json
    expire_in: 1 week
    when: always
  script:
    - curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
    - unzip pipeline-scan-LATEST.zip pipeline-scan.jar
    - java -jar pipeline-scan.jar
      --veracode_api_id "${VERACODE_API_ID}"
      --veracode_api_key "${VERACODE_API_SECRET}"
      --file "build/libs/sample.jar"
      --fail_on_severity="Very High, High"
      --fail_on_cwe="80"
      --baseline_file "${CI_BASELINE_PATH}"
      --timeout "${CI_TIMEOUT}"
      --project_name "${CI_PROJECT_PATH}"
      --project_url "${CI_REPOSITORY_URL}"
      --project_ref "${CI_COMMIT_REF_NAME}"
      --gl_vulnerability_generation true
```

#### GitLab & Gradle (with automatic vulnerability generation with builtin policy)

We use this structure in GitLab CI to self-test, setting the `$VERACODE_API_*` variables in the CI/CD Settings. The builtin --policy_name option or --policy_file options are used as a replacement for the --file_on_severity and --fail_on_cwe filters

```yml
# image must have JDK8+, gradle, curl, unzip
image: <image-with-above-requirements>

stages:
  - build
  - scan

build_job:
  stage: build
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_build
    paths:
      - build/
    expire_in: 1 week
  script: gradle clean build

pipeline scan:
  stage: scan
  dependencies:
    - build_job
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_pipeline-results
    paths:
      - results.json
      - veracode_gitlab_vulnerabilities.json
    reports: 
      sast: veracode_gitlab_vulnerabilities.json
    expire_in: 1 week
    when: always
  script:
    - curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
    - unzip pipeline-scan-LATEST.zip pipeline-scan.jar
    - java -jar pipeline-scan.jar
      --veracode_api_id "${VERACODE_API_ID}"
      --veracode_api_key "${VERACODE_API_SECRET}"
      --file "build/libs/sample.jar"
      --policy_name="Veracode Recommended Very High"
      --baseline_file "${CI_BASELINE_PATH}"
      --timeout "${CI_TIMEOUT}"
      --project_name "${CI_PROJECT_PATH}"
      --project_url "${CI_REPOSITORY_URL}"
      --project_ref "${CI_COMMIT_REF_NAME}"
      --gl_vulnerability_generation true
```


#### GitLab & Gradle (with automatic vulnerability generation with custom policy)
A previously downloaded and packaged policy file can be specified then used in the pipeline. 
To download policy locally for later use in the pipeline, use the --request_policy option as in the following example:

 ```
 - java -jar pipeline-scan.jar
       --veracode_api_id "${VERACODE_API_ID}"
       --veracode_api_key "${VERACODE_API_SECRET}"
       --request_policy="Custom Policy"    
 ```
 
 The locally generated policy file will be automatically given the name Custom_Policy.json. It should be placed in a location accessible 
 to the pipeline for its subsequent use. The --policy_file option will be used to specify the local custom policy for vulnerability filtering as before:

```yml
# image must have JDK8+, gradle, curl, unzip
image: <image-with-above-requirements>

stages:
  - build
  - scan

build_job:
  stage: build
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_build
    paths:
      - build/
    expire_in: 1 week
  script: gradle clean build

pipeline scan:
  stage: scan
  dependencies:
    - build_job
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_pipeline-results
    paths:
      - results.json
      - veracode_gitlab_vulnerabilities.json
    reports: 
      sast: veracode_gitlab_vulnerabilities.json
    expire_in: 1 week
    when: always
  script:
    - curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
    - unzip pipeline-scan-LATEST.zip pipeline-scan.jar
    - java -jar pipeline-scan.jar
      --veracode_api_id "${VERACODE_API_ID}"
      --veracode_api_key "${VERACODE_API_SECRET}"
      --file "build/libs/sample.jar"
      --policy_file="Custom_Policy.json"
      --baseline_file "${CI_BASELINE_PATH}"
      --timeout "${CI_TIMEOUT}"
      --project_name "${CI_PROJECT_PATH}"
      --project_url "${CI_REPOSITORY_URL}"
      --project_ref "${CI_COMMIT_REF_NAME}"
      --gl_vulnerability_generation true
```

#### GitLab & Gradle (with automatic issue generation)
We use this structure in GitLab CI to self-test, setting the `$VERACODE_API_*` variables in the CI/CD Settings.

```yml
# image must have JDK8+, gradle, curl, unzip
image: <image-with-above-requirements>

stages:
  - build
  - scan

build_job:
  stage: build
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_build
    paths:
      - build/
    expire_in: 1 week
  script: gradle clean build

pipeline scan:
  stage: scan
  dependencies:
    - build_job
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_pipeline-results
    paths:
      - results.json
    expire_in: 1 week
    when: always
  script:
    - curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
    - unzip pipeline-scan-LATEST.zip pipeline-scan.jar
    - java -jar pipeline-scan.jar
      --veracode_api_id "${VERACODE_API_ID}"
      --veracode_api_key "${VERACODE_API_SECRET}"
      --file "build/libs/sample.jar"
      --fail_on_severity="Very High, High"
      --fail_on_cwe="80"
      --baseline_file "${CI_BASELINE_PATH}"
      --timeout "${CI_TIMEOUT}"
      --project_name "${CI_PROJECT_PATH}"
      --project_url "${CI_REPOSITORY_URL}"
      --project_ref "${CI_COMMIT_REF_NAME}"
      --gl_issue_generation true
```

#### GitLab & Gradle


```yml
# image must have JDK8+, gradle, curl, unzip
image: <image-with-above-requirements>

stages:
  - build
  - scan

build_job:
  stage: build
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_build
    paths:
      - build/
    expire_in: 1 week
  script: gradle clean build

pipeline scan:
  stage: scan
  dependencies:
    - build_job
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_pipeline-results
    paths:
      - results.json
    expire_in: 1 week
    when: always
  script:
    - curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
    - unzip pipeline-scan-LATEST.zip pipeline-scan.jar
    - java -jar pipeline-scan.jar
      --veracode_api_id "${VERACODE_API_ID}"
      --veracode_api_key "${VERACODE_API_SECRET}"
      --file "build/libs/sample.jar"
      --fail_on_severity="Very High, High"
      --fail_on_cwe="80"
      --baseline_file "${CI_BASELINE_PATH}"
      --timeout "${CI_TIMEOUT}"
      --project_name "${CI_PROJECT_PATH}"
      --project_url "${CI_REPOSITORY_URL}"
      --project_ref "${CI_COMMIT_REF_NAME}"
```

#### GitLab & Maven

```yml
# image must have JDK8+, gradle, curl, unzip
image: <image-with-above-requirements>

stages:
  - build
  - scan

build_job:
  stage: build
  script:
    - maven clean verify
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_build
    paths:
      - build/
    expire_in: 1 week

pipeline scan:
  stage: scan
  dependencies:
    - build_job
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_pipeline-results
    paths:
      - results.json
    expire_in: 1 week
    when: always
  script:
    - curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
    - unzip pipeline-scan-LATEST.zip pipeline-scan.jar
    - java -jar pipeline-scan.jar
      --veracode_api_id "${VERACODE_API_ID}"
      --veracode_api_key "${VERACODE_API_SECRET}"
      --file "build/libs/sample.jar"
      --gitlab_api_token "${PRIVATE_TOKEN}"
      --fail_on_severity="Very High, High"
      --fail_on_cwe="80"
      --baseline_file "${CI_BASELINE_PATH}"
      --timeout "${CI_TIMEOUT}"
      --project_name "${CI_PROJECT_PATH}"
      --project_url "${CI_REPOSITORY_URL}"
      --project_ref "${CI_COMMIT_REF_NAME}"
```

#### Storing and using a baseline file with GitLab

```yml
# image must have JDK8+, gradle, curl, unzip
image: <image-with-above-requirements>

stages:
  - build
  - scan
  - store

build_job:
  stage: build
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_build
    paths:
      - build/
    expire_in: 1 week
  script: gradle clean build

Scan:
  stage: scan
  only:
    - master
  dependencies:
    - build_job
  artifacts:
    name: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}_${CI_COMMIT_SHA}_pipeline-results
    paths:
      - baseline.json
    expire_in: 1 week
    when: always
  script:
    - curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
    - unzip pipeline-scan-LATEST.zip pipeline-scan.jar
    - java -jar pipeline-scan.jar
      --veracode_api_id "${VERACODE_API_ID}"
      --veracode_api_key "${VERACODE_API_SECRET}"
      --file "build/libs/sample.jar"
      --fail_on_severity="Very High, High"
      --fail_on_cwe="80"
      --json_output_file="baseline.json"
      --timeout "${CI_TIMEOUT}"
      --project_name "${CI_PROJECT_PATH}"
      --project_url "${CI_REPOSITORY_URL}"
      --project_ref "${CI_COMMIT_REF_NAME}"

Store Baseline:
  # Job will only run on master, if requested.
  # Will restore the above baseline artifact so it can be pulled down in other stages
  stage: store
  before_script:
  only:
    - master
  when: manual
  script:
    - echo "Storing results.json as baseline.json"
  artifacts:
    name: baseline
    paths:
      - baseline.json # If you want to keep this longer than the GitLab default - press store in the web UI

Baseline Scan:
  # Job will run anywhere, except master. Will pull the baseline file and use it in the scan, if available
  dependencies:
    - Scan
  except:
    - master
  stage: scan
  script:
    - git clean -dfx
    - 'curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip'
    - unzip pipeline-scan-LATEST.zip pipeline-scan.jar
    - '[[ ! -f baseline.json ]] &&  curl --location "$CI_PROJECT_URL/-/jobs/artifacts/$CI_COMMIT_REF_NAME/raw/baseline.json?job=Store%20Baseline" -o baseline.json'
    - java -jar pipeline-scan.jar --veracode_api_id "${VERACODE_KEY}" --veracode_api_key "${VERACODE_SECRET}" --file "<file_to_scan>" --project_name "${CI_PROJECT_PATH}" --project_url "${CI_PROJECT_URL}" --project_ref "${CI_COMMIT_REF_NAME}" --baseline_file baseline.json -jf results.json
```

### Jenkins

Pipeline Scan can be added as a job in a [Jenkins Declarative Pipeline](https://www.jenkins.io/doc/book/pipeline/).  Jenkins pipelines can be configured with a ["Jenkinsfile"](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/) that defines stages of running it.   The code below provide examples of how to configure Jenkins to build a project and run Pipeline Scan as a stage in the pipeline.

#### Jenkins & Gradle

```groovy
pipeline {
  agent { label <'any-with-jdk8-gradle-curl-unzip'> }
  stages {
    stage('Gradle Build') {
      steps {
        sh 'gradle clean build'
      }
    }
    stage('Veracode Pipeline Scan') {
      steps {
        sh 'curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip'
        sh 'unzip pipeline-scan-LATEST.zip pipeline-scan.jar'
        sh 'java -jar pipeline-scan.jar \
          --veracode_api_id "${VERACODE_API_ID}" \
          --veracode_api_key "${VERACODE_API_SECRET}" \
          --file "build/libs/sample.jar" \
          --fail_on_severity="Very High, High" \
          --fail_on_cwe="80" \
          --baseline_file "${CI_BASELINE_PATH}" \
          --timeout "${CI_TIMEOUT}" \
          --project_name "${env.JOB_NAME}" \
          --project_url "${env.GIT_URL}" \
          --project_ref "${env.GIT_COMMIT}"'
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'results.json', fingerprint: true
    }
  }
}
```

#### Jenkins & Maven

```groovy
pipeline {
  agent { label <'any-with-jdk8-maven-curl-unzip'> }
  stages {
    stage('Maven Build') {
      steps {
        sh 'maven clean verify'
      }
    }
    stage('Veracode Pipeline Scan') {
      steps {
        sh 'curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip'
        sh 'unzip pipeline-scan-LATEST.zip pipeline-scan.jar'
        sh 'java -jar pipeline-scan.jar \
          --veracode_api_id "${VERACODE_API_ID}" \
          --veracode_api_key "${VERACODE_API_SECRET}" \
          --file "build/libs/sample.jar" \
          --fail_on_severity="Very High, High" \
          --fail_on_cwe="80" \
          --baseline_file "${CI_BASELINE_PATH}" \
          --timeout "${CI_TIMEOUT}" \
          --project_name "${env.JOB_NAME}" \
          --project_url "${env.GIT_URL}" \
          --project_ref "${env.GIT_COMMIT}"'
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'results.json', fingerprint: true
    }
  }
}
```

#### Storing and using a baseline file with Jenkins
This is just one example of how to use a baseline file. It uses a single pipeline for the build and Pipeline Scan process, then stores the baseline file as an artifact each time a job is run. This can be modified so that the Pipeline Scan can run as its own pipeline and be triggered by another job. Depending on your build configuration it may also be desirable to store results in separate globally accessible location such as a shared directory, S3, etc.

```groovy
pipeline {
    agent { label <'any-with-jdk8-maven-curl-unzip'> }
    stages {
        stage('Clone Repo') {
            steps {
                git url: "$GIT_URL", branch: "$GIT_BRANCH", credentialsId: 'ae020d0c-c99b-4a6c-9663-7a2e0290648c'
            }
        }
        stage('Gradle Build') {
            steps {
                sh './gradlew clean build'
            }
        }
        stage('Veracode Pipeline Scan') {
            steps {
                // Copy baseline from previous build
                copyArtifacts(projectName: "$JOB_NAME", selector: lastSuccessful(stable: true), filter: 'baseline.json', target: '.', optional: true)
                script {
                    ref = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    baseline = ''
                    if (fileExists('baseline.json')) {
                        baseline = '--baseline_file baseline.json'
                    }
                }

                // Download and submit Pipeline Scan
                sh 'curl -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip'
                sh 'unzip pipeline-scan-LATEST.zip pipeline-scan.jar'
                sh """
                    java -jar pipeline-scan.jar \
                        --veracode_api_id "${env.VERACODE_API_KEY_ID}" \
                        --veracode_api_key "${env.VERACODE_API_KEY_SECRET}" \
                        --jf results.json \
                        --timeout "$timeout" \
                        --file "build/libs/sample.jar" \
                        --project_name "$JOB_NAME" \
                        --project_url "$GIT_URL" \
                        --project_ref "$ref" 
                        $baseline
                """
            }
        }
        stage('Store Baseline') {
            steps {
                script {
                    try {
                        input(message: 'Store results as baseline for future scans?', ok: 'Yes')
                        sh 'cp baseline.json build-baseline.json'
                        sh 'cp results.json baseline.json'
                    } catch (err) {

                    }
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: "*.json", fingerprint: true, allowEmptyArchive: true
            deleteDir()
        }
    }
}
```

### GitHub

Pipeline Scan can be added as a step in a [Github Actions](https://docs.github.com/en/actions) workflow.  GitHub Action workflows are configured by by YAML configuration files. The YAML code below provide examples of how to configure a workflow to build a project and run Pipeline Scan as a step in the workflow.

#### GitHub Actions & Gradle

```yml
name: pipeline-scan

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: build
        run: gradle clean build
  pipeline-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Set up JDK 1.8
        uses: actions/setup-java@v1
        with:
          java-version: 1.8
      - name: Download the Pipeline Scanner
        uses: wei/curl@master
        with:
          args: -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
      - name: Unzip the Pipeline Scanner
        run: unzip pipeline-scan-LATEST.zip
      - name: Run Pipeline Scanner
        run: java -Dpipeline.debug=true -jar pipeline-scan.jar --veracode_api_id "${{secrets.VERACODE_API_ID}}" --veracode_api_key "${{secrets.VERACODE_API_KEY}}" --file "example.jar" --fail_on_severity="Very High, High"
```

#### Github Actions & Maven

```yml
name: pipeline-scan

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: build
        run: maven clean verify
  pipeline-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Set up JDK 1.8
        uses: actions/setup-java@v1
        with:
          java-version: 1.8
      - name: Download the Pipeline Scanner
        uses: wei/curl@master
        with:
          args: -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
      - name: Unzip the Pipeline Scanner
        run: unzip pipeline-scan-LATEST.zip
      - name: Run Pipeline Scanner
        run: java -Dpipeline.debug=true -jar pipeline-scan.jar --veracode_api_id "${{secrets.VERACODE_API_ID}}" --veracode_api_key "${{secrets.VERACODE_API_KEY}}" --file "example.jar" --fail_on_severity="Very High, High"
```

#### Storing and using baseline file with Github Actions

```yml
name: pipeline-scan

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: build
        run: gradle clean build
  baseline:
    runs-on: ubuntu-latest
    steps:
      - name: Set up JDK 1.8
        uses: actions/setup-java@v1
        with:
          java-version: 1.8
      - name: Download the Pipeline Scanner
        uses: wei/curl@master
        with:
          args: -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
      - name: Unzip the Pipeline Scanner
        run: unzip pipeline-scan-LATEST.zip
      - name: Create Baseline
        run: java -Dpipeline.debug=true -jar pipeline-scan.jar --veracode_api_id "${{secrets.VERACODE_API_ID}}" --veracode_api_key "${{secrets.VERACODE_API_KEY}}" --file "example.jar" --json_output_file="baseline.json" || true
      - name: Upload Baseline
        uses: actions/upload-artifact@v1
        with:
          name: baseline
          path: baseline.json
  baseline-scan:
    runs-on: ubuntu-latest
    needs: baseline
    steps:
      - name: Set up JDK 1.8
        uses: actions/setup-java@v1
        with:
          java-version: 1.8
      - name: Download the Pipeline Scanner
        uses: wei/curl@master
        with:
          args: -O https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
      - name: Unzip the Pipeline Scanner
        run: unzip pipeline-scan-LATEST.zip
      - name: download baseline
        uses: actions/download-artifact@v1
        with:
          name: baseline
      - name: Scan with baseline
        run: java -Dpipeline.debug=true -jar pipeline-scan.jar --veracode_api_id "${{secrets.VERACODE_API_ID}}" --veracode_api_key "${{secrets.VERACODE_API_KEY}}" --file "example.jar" --baseline_file "baseline/baseline.json"
```

### Azure DevOps

Pipeline scan can be added as a job in an [Azure DevOps Pipeline](https://docs.microsoft.com/en-us/azure/devops/). AzureDevOps Pipelines are [customized with YAML file](https://docs.microsoft.com/en-us/azure/devops/pipelines/customize-pipeline?view=azure-devops) that defines steps of running the pipeline. The YAML code below provide examples of how to configure AzureDevOps to build a project and run Pipeline Scan as a stage in the pipeline.

#### Azure DevOps YAML Pipeline & Gradle

```yml

trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: Gradle@2
  inputs:
    workingDirectory: ''
    gradleWrapperFile: 'gradlew'
    gradleOptions: '-Xmx3072m'
    javaHomeOption: 'JDKVersion'
    jdkVersionOption: '1.8'
    jdkArchitectureOption: 'x64'
    publishJUnitResults: true
    testResultsFiles: '**/TEST-*.xml'
    tasks: 'build'
- script: |
    curl -O -L https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
  displayName: 'Download Pipeline Scanner'
- task: ExtractFiles@1
  inputs:
    archiveFilePatterns: 'pipeline-scan-LATEST.zip'
    destinationFolder: 'pipeline'
    cleanDestinationFolder: false
- script: |
      java -jar pipeline\pipeline-scan.jar --veracode_api_id "$(VERACODE_API_ID)" --veracode_api_key "$(VERACODE_API_KEY)" --file "example.jar" --fail_on_severity="Very High, High" --fail_on_cwe="80"
  env:
    VERACODE_API_ID: $(VERACODE_API_ID)
    VERACODE_API_KEY: $(VERACODE_API_KEY)
  displayName: 'Run Pipeline Scan'
```

#### Azure DevOps YAML Pipeline & Maven

```yml

trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
# Maven
# Build, test, and deploy with Apache Maven
- task: Maven@3
  inputs:
    mavenPomFile: 'pom.xml'
    goals: 'package' # Optional
    options: # Optional
    publishJUnitResults: true
    testResultsFiles: '**/surefire-reports/TEST-*.xml' # Required when publishJUnitResults == True
    testRunTitle: # Optional
    codeCoverageToolOption: 'None' # Optional. Options: none, cobertura, jaCoCo. Enabling code coverage inserts the `clean` goal into the Maven goals list when Maven runs.
    codeCoverageClassFilter: # Optional. Comma-separated list of filters to include or exclude classes from collecting code coverage. For example: +:com.*,+:org.*,-:my.app*.*
    codeCoverageClassFilesDirectories: # Optional
    codeCoverageSourceDirectories: # Optional
    codeCoverageFailIfEmpty: false # Optional
    javaHomeOption: 'JDKVersion' # Options: jDKVersion, path
    jdkVersionOption: 'default' # Optional. Options: default, 1.11, 1.10, 1.9, 1.8, 1.7, 1.6
    jdkDirectory: # Required when javaHomeOption == Path
    jdkArchitectureOption: 'x64' # Optional. Options: x86, x64
    mavenVersionOption: 'Default' # Options: default, path
    mavenDirectory: # Required when mavenVersionOption == Path
    mavenSetM2Home: false # Required when mavenVersionOption == Path
    mavenOptions: '-Xmx1024m' # Optional
    mavenAuthenticateFeed: false
    effectivePomSkip: false
    sonarQubeRunAnalysis: false
    sqMavenPluginVersionChoice: 'latest' # Required when sonarQubeRunAnalysis == True# Options: latest, pom
    checkStyleRunAnalysis: false # Optional
    pmdRunAnalysis: false # Optional
    findBugsRunAnalysis: false # Optional
- script: |
    curl -O -L https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
  displayName: 'Download Pipeline Scanner'
- task: ExtractFiles@1
  inputs:
    archiveFilePatterns: 'pipeline-scan-LATEST.zip'
    destinationFolder: 'pipeline'
    cleanDestinationFolder: false
- script: |
      java -jar pipeline\pipeline-scan.jar --veracode_api_id "$(VERACODE_API_ID)" --veracode_api_key "$(VERACODE_API_KEY)" --file "example.jar" --fail_on_severity="Very High, High" --fail_on_cwe="80"
  env:
    VERACODE_API_ID: $(VERACODE_API_ID)
    VERACODE_API_KEY: $(VERACODE_API_KEY)
  displayName: 'Run Pipeline Scan'
```

#### Storing and using a baseline file with Azure DevOps

```yml

# generate baseline
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: Gradle@2
  inputs:
    workingDirectory: ''
    gradleWrapperFile: 'gradlew'
    gradleOptions: '-Xmx3072m'
    javaHomeOption: 'JDKVersion'
    jdkVersionOption: '1.8'
    jdkArchitectureOption: 'x64'
    publishJUnitResults: true
    testResultsFiles: '**/TEST-*.xml'
    tasks: 'build'
- script: |
    curl -O -L https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
  displayName: 'Download Pipeline Scanner'
- task: ExtractFiles@1
  inputs:
    archiveFilePatterns: 'pipeline-scan-LATEST.zip'
    destinationFolder: 'pipeline'
    cleanDestinationFolder: false
- script: |
      java -jar pipeline\pipeline-scan.jar --veracode_api_id "$(VERACODE_API_ID)" --veracode_api_key "$(VERACODE_API_KEY)" --file "example.jar" --json_output_file="baseline.json" || true
  env:
    VERACODE_API_ID: $(VERACODE_API_ID)
    VERACODE_API_KEY: $(VERACODE_API_KEY)
  displayName: 'Run Pipeline Scan'
- publish: $(System.DefaultWorkingDirectory)/baseline.json
  artifact: baseline

# use baseline
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- script: |
    curl -O -L https://downloads.veracode.com/securityscan/pipeline-scan-LATEST.zip
  displayName: 'Download Pipeline Scanner'
- task: ExtractFiles@1
  inputs:
    archiveFilePatterns: 'pipeline-scan-LATEST.zip'
    destinationFolder: 'pipeline'
    cleanDestinationFolder: false
- task: DownloadPipelineArtifact@2
  inputs:
    source: specific
    project: 'test'
    pipeline: 2
    artifact: baseline
- script: |
    java -jar pipeline\pipeline-scan.jar --veracode_api_id "$(VERACODE_API_ID)" --veracode_api_key "$(VERACODE_API_KEY)" --file "example.jar" --baseline_file "../baseline.json"
  env:
    VERACODE_API_ID: $(VERACODE_API_ID)
    VERACODE_API_KEY: $(VERACODE_API_KEY)
  displayName: 'Run Pipeline Scan'
```

## Example Summary Output

### Default Summary

```console
====================
Analysis Successful.
====================

===================
Analyzed 2 modules.
===================
Module1.war
Module2.war

======================
Analyzed 11 issues!
======================
-------------------------------------
Found 1 issues of Very High severity.
-------------------------------------
CWE-78: Improper Neutralization of Special Elements used in an OS Command ('OS Command Injection'): flawedpackage/Flawed.java:50
--------------------------------
Found 1 issues of High severity.
--------------------------------
CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection'): flawedpackage/Flawed.java:43
----------------------------------
Found 7 issues of Medium severity.
----------------------------------
CWE-326: Inadequate Encryption Strength: flawedpackage/GreenLightKeySizeHMAC.java:38
CWE-259: Use of Hard-coded Password: flawedpackage/Flawed.java:23
CWE-259: Use of Hard-coded Password: flawedpackage/Flawed.java:54
CWE-331: Insufficient Entropy: flawedpackage/Flawed.java:59
CWE-327: Use of a Broken or Risky Cryptographic Algorithm: flawedpackage/Flawed.java:60
CWE-327: Use of a Broken or Risky Cryptographic Algorithm: flawedpackage/Flawed.java:61
CWE-326: Inadequate Encryption Strength: flawedpackage/Flawed.java:68
-------------------------------
Found 2 issues of Low severity.
-------------------------------
CWE-597: Use of Wrong Operator in String Comparison: flawedpackage/OneFlaw.java:5
CWE-404: Improper Resource Shutdown or Release: flawedpackage/Flawed.java:37

=========================
FAILURE: Found 11 issues!
=========================
```

### Issue Details Expanded

Using `--issue_details=true`

```console
====================
Analysis Successful.
====================

===================
Analyzed 2 modules.
===================
Module1.war
Module2.war

==================
Analyzed 2 issues.
==================
-------------------------------
Found 2 issues of Low severity.
-------------------------------
CWE-209: Information Exposure Through an Error Message: tiles/error/errorUncaughtMessage.jsp:9
Details: <span> The application calls the javax.servlet.jsp.JspWriter.print() function, which may expose information about the application logic or other 
details such as the names and versions of the application container and associated components.  This information can be useful in executing other attacks 
and can also enable the attacker to target known vulnerabilities in application components. </span> <span>Ensure that error codes or other messages 
returned to end users are not overly verbose.  Sanitize all messages of any sensitive information that is not absolutely necessary.</span> 
<span>References: <a href="https://cwe.mitre.org/data/definitions/209.html">CWE</a></span>
https://downloads.veracode.com/securityscan/cwe/v4/java/209.html
CWE-245: J2EE Bad Practices: Direct Management of Connections: edu/ufl/osg/webmail/prefs/DBPrefsPlugIn.java:172
Details: <span>This call to getConnection() fails to use the J2EE container's resource management facilities as required by the J2EE standard.</span> 
<span>Request the connection from the container rather than attempting to access it directly.</span> <span>References: <a href="https://cwe.mitre.
org/data/definitions/245.html">CWE</a></span>
https://downloads.veracode.com/securityscan/cwe/v4/java/245.html
========================
FAILURE: Found 2 issues!
========================
```

### Severity Filters

Using `--fail_on_severity="Very High, High"`

**Note: GitLab sometimes strips quotes when expanding variables, thus exposing any spaces in the variable to the shell, and the entire parameter will not be set correctly if it contains spaces. If the filter arguments are in a variable, you may need to remove all spaces from the parameter (the tool can handle filter parameters both with and without spaces).

```console
====================
Analysis Successful.
====================

===================
Analyzed 2 modules.
===================
Module1.war
Module2.war

==================
Analyzed 1 issues.
==================
----------------------------------
Skipping 1 issues of Low Severity.
----------------------------------

==================================
SUCCESS: No issues passed filters.
==================================
```

### CWE Filters

Using `--fail_on_cwe="89, 331"`

```console
====================
Analysis Successful.
====================

===================
Analyzed 2 modules.
===================
Module1.war
Module2.war

==================
Analyzed 5 issues.
==================
--------------------------
Found 1 issues of CWE 331.
--------------------------
CWE-331: Insufficient Entropy: flawedPackage/Flawed.java:49
-------------------------
Found 1 issues of CWE 89.
-------------------------
CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection'): flawedPackage/Flawed.java:33

========================
FAILURE: Found 2 issues!
========================
```

### Baseline Filters

Using `--baseline [baseline_file_path]`

```console
====================
Analysis Successful.
====================

===================
Analyzed 2 modules.
===================
Module1.war
Module2.war

==================
Analyzed 3 issues.
==================
----------------------------------
Found 2 issues of Medium severity.
----------------------------------
CWE-470: Use of Externally-Controlled Input to Select Classes or Code ('Unsafe Reflection'): org/apache/sqoop/test/hive/MetastoreServerRunnerFactory.java:50
CWE-470: Mock Issue 2 ('Mock Issue: Soumyadeep Sinha'): org/apache/sqoop/test/hive/MetastoreServerRunnerFactory.java:50
****************************************************************
Total flaws found: 3, New flaws found: 2 as compared to baseline
****************************************************************

========================
FAILURE: Found 2 issues!
========================

```

## Command Line Arguments Details

```console
usage: java -jar pipeline-scan.jar
       [-h] [-v] (-f FILE | -rp REQUEST_POLICY) [-prof VERACODE_PROFILE] [-vkey VERACODE_API_KEY] [-vid VERACODE_API_ID]
       [-fs FAIL_ON_SEVERITY] [-fc FAIL_ON_CWE] [-bf BASELINE_FILE] [-t TIMEOUT]
       [-id {true,false}] [-sd {true,false}] [-jd {true,false}] 
       [-so {true,false}] [-sf SUMMARY_OUTPUT_FILE] [-jo {true,false}] [-jf JSON_OUTPUT_FILE]
       [-p PROJECT_NAME] [-u PROJECT_URL] [-r PROJECT_REF] [-aid APP_ID] [-ds {Development,Testing,Release}]
       [-gig {true,false}] [-gvg {true,false}]
       [-pn POLICY_NAME | -pf POLICY_FILE]

Scan a pre-built JAR with Veracode Pipeline Scan CI Tool.

Results JSON will always be output to file storage. A human-readable summary will also be output to file storage
if the results contain any findings.

Either or both can also be displayed on the console as well, see the help [-h] for details. Adding '-Dpipeline.
debug=true' to the java command will increase verbosity of the console output.

Named Arguments:
  -h, --help             Show this help message and exit.
  -v, --version          Display version info and exit.

Required:
  -f FILE, --file FILE   File to upload and scan.
    OR
  -rp REQUEST_POLICY, --request_policy REQUEST_POLICY
                           Name of the policy to be download.
Credentials:
  -prof VERACODE_PROFILE, --veracode_profile VERACODE_PROFILE
                         Identify which Veracode API credentials file provides your API credentials. Defaults to the default profile.
  -vkey VERACODE_API_KEY, --veracode_api_key VERACODE_API_KEY
                         Veracode API Key.
  -vid VERACODE_API_ID, --veracode_api_id VERACODE_API_ID
                         Veracode API ID.

Scan Configuration:
  -fs FAIL_ON_SEVERITY, --fail_on_severity FAIL_ON_SEVERITY
                         Set analysis to fail for issues of the given severities. Comma-separated list of
                         severities, in quotes. Example: '--fail_on_severity="Very High, High"' would only report
                         if issues of severity 'Very High' or 'High' exist in the scan. The default is to report
                         issues of Severities Very Low and above. (default: "Very High, High, Medium, Low, Very
                         Low")
  -fc FAIL_ON_CWE, --fail_on_cwe FAIL_ON_CWE
                         Set analysis to fail for the given CWEs. Comma-separated list of severities, Example: '--
                         fail_on_cwe=95,100,978' would only report if issues of CWEs 95, 100, or 978, exist in the
                         scan. The default is to report issues of all CWEs.
  -bf BASELINE_FILE, --baseline_file BASELINE_FILE
                         Provide the baseline file.
  -t TIMEOUT, --timeout TIMEOUT
                         User timeout from CI tool. (default: 60)						 

Results Display:
  -id {true,false}, --issue_details {true,false}
                         Show detailed messages for each issue in the results summary. (default: false)
  -sd {true,false}, --summary_display {true,false}
                         Show human-readable results summary on the console. (default: true)
  -jd {true,false}, --json_display {true,false}
                         Show the results JSON on the console. (default: false)

Saving Results:
  -so {true,false}, --summary_output {true,false}
                         Save human-readable results summary to file. (default: false)
  -sf SUMMARY_OUTPUT_FILE, --summary_output_file SUMMARY_OUTPUT_FILE
                         Filename (in the current directory) to save results summary. (default: results.txt)
  -jo {true,false}, --json_output {true,false}
                         Save results JSON to file. (default: true)
  -jf JSON_OUTPUT_FILE, --json_output_file JSON_OUTPUT_FILE
                         Filename (in the current directory) to save results JSON. (default: results.json)
  -gig {true,false}, --gl_issue_generation {true,false}
                         Create GitLab issues from the scan results. (default: false)

                        In order to use the issue generation feature, the API path should be configured correctly as a CI/CD variable:
                        `GITLAB_URL` = "https://{GitLab Domain}/api/v4/projects/". This value defaults to "https://gitlab.com/api/v4/projects/".
  -gvg {true,false}, --gl_vulnerability_generation {true,false}
                         Create a JSON file from scan results that is automatically imported as GitLab vulnerablities.(default: false)

                         In order to use vulnerability generation `veracode_gitlab_vulnerabilities.json` must be saved as an artifact
                         and set as a `sast` file under the `reports` heading in the CI/CD configuration. An example can be seen in the
                         the 'GitLab & Gradle (with automatic vulnerability generation)' example.

Veracode Platform Policy:
  -pn POLICY_NAME, --policy_name POLICY_NAME
                         Name of the Veracode Platform Policy to be applied to the scan results.
  -pf POLICY_FILE, --policy_file POLICY_FILE
                         Name of the local policy file to be applied to the scan results.


Project Metadata:
  Optional: Details about the project. Will be attached to the results summary and results JSON, and stored on the
  Veracode backend for reporting purposes.

  -p PROJECT_NAME, --project_name PROJECT_NAME
                         Project name.
  -u PROJECT_URL, --project_url PROJECT_URL
                         Source control URI.
  -r PROJECT_REF, --project_ref PROJECT_REF
                         Source control ref/revision/branch.
  -aid APP_ID, --app_id APP_ID
                         Veracode Platform Application ID.
  -ds {Development,Testing,Release}, --development_stage {Development,Testing,Release}
                         Development Stage.

```

#### Policy Names
The following Veracode Policy names can be used to perform scan pass/fail filtering
``` 
PCI 3.2.1
Veracode Recommended High
Veracode Recommended High + SCA
Veracode Recommended Low
Veracode Recommended Medium
Veracode Recommended Medium + SCA
Veracode Recommended Mobile Policy
Veracode Recommended Very High
Veracode Recommended Very High + SCA
```
