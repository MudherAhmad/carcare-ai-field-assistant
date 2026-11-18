package ai.carcare.fieldassistant.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ai.carcare.fieldassistant.data.EngineResult
import ai.carcare.fieldassistant.ai.RedactionResult

private val Ink = Color(0xFF102B27)
private val Paper = Color(0xFFF4F0E7)
private val PaperBright = Color(0xFFFFFDF8)
private val Lime = Color(0xFFD9FF80)
private val Coral = Color(0xFFFF8C68)

@Composable
fun FieldAssistantScreen(viewModel: FieldAssistantViewModel) {
    val state = viewModel.state
    val t = messages(state.language)
    val direction = if (state.language == "ar") LayoutDirection.Rtl else LayoutDirection.Ltr
    CompositionLocalProvider(LocalLayoutDirection provides direction) {
        Surface(color = Paper, modifier = Modifier.fillMaxSize()) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 18.dp, vertical = 20.dp),
                verticalArrangement = Arrangement.spacedBy(18.dp),
            ) {
                item { AppBar(state.language, !state.loading, viewModel::setLanguage) }
                item { Hero(t, viewModel.isAvailable, viewModel.isSyntheticDemo) }
                item {
                    InputCard(
                        t = t,
                        state = state,
                        intake = viewModel.redaction,
                        technician = viewModel.technicianRedaction,
                        available = viewModel.isAvailable,
                        synthetic = viewModel.isSyntheticDemo,
                        onVehicle = viewModel::setVehicle,
                        onMileage = viewModel::setMileage,
                        onNotes = viewModel::setNotes,
                        onSample = viewModel::loadSample,
                        onReviewEvidence = viewModel::setReviewEvidence,
                        onTechnicianNote = viewModel::setTechnicianNote,
                        onGenerate = viewModel::generate,
                    )
                }
                state.result?.let { item { ReportCard(it, t) } }
                item {
                    Text(
                        t.disclaimer,
                        color = Ink.copy(alpha = 0.6f),
                        fontSize = 11.sp,
                        modifier = Modifier.fillMaxWidth().padding(vertical = 14.dp),
                    )
                }
            }
        }
    }
}

@Composable
private fun AppBar(language: String, enabled: Boolean, onLanguage: (String) -> Unit) {
    Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Box(modifier = Modifier.size(38.dp).background(Ink, RoundedCornerShape(12.dp)), contentAlignment = Alignment.Center) {
                Text("AI", color = Lime, fontWeight = FontWeight.Black, fontSize = 12.sp)
            }
            Text("CarCare AI", color = Ink, fontWeight = FontWeight.Black, fontSize = 18.sp)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
            listOf("en", "sv", "ar").forEach { code ->
                FilterChip(selected = language == code, onClick = { onLanguage(code) }, enabled = enabled, label = { Text(code.uppercase(), fontSize = 10.sp) })
            }
        }
    }
}

@Composable
private fun Hero(t: UiMessages, available: Boolean, synthetic: Boolean) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.padding(top = 28.dp, bottom = 10.dp)) {
        Text(t.eyebrow, color = MaterialTheme.colorScheme.secondary, fontWeight = FontWeight.Black, fontSize = 11.sp, letterSpacing = 1.4.sp)
        Text(t.title, color = Ink, fontFamily = FontFamily.Serif, fontSize = 43.sp, lineHeight = 44.sp, fontWeight = FontWeight.Medium)
        Text(t.subtitle, color = Ink.copy(alpha = 0.64f), lineHeight = 22.sp, fontSize = 15.sp)
        StatusPill(if (synthetic) t.syntheticDemo else if (available) "Firebase AI Logic · ready" else t.setupRequired, available)
    }
}

@Composable
private fun StatusPill(text: String, good: Boolean) {
    Row(
        modifier = Modifier.background(if (good) Color(0xFFE1F0E7) else Color(0xFFFFE7DD), RoundedCornerShape(100.dp)).padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Box(Modifier.size(8.dp).background(if (good) Color(0xFF3C8B65) else Coral, CircleShape))
        Text(text, color = Ink, fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun InputCard(
    t: UiMessages,
    state: FieldUiState,
    intake: RedactionResult,
    technician: RedactionResult,
    available: Boolean,
    synthetic: Boolean,
    onVehicle: (String) -> Unit,
    onMileage: (String) -> Unit,
    onNotes: (String) -> Unit,
    onSample: (Boolean) -> Unit,
    onReviewEvidence: (Boolean) -> Unit,
    onTechnicianNote: (String) -> Unit,
    onGenerate: () -> Unit,
) {
    Card(colors = CardDefaults.cardColors(containerColor = PaperBright), shape = RoundedCornerShape(26.dp), elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)) {
        Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text(t.vehicle, fontFamily = FontFamily.Serif, fontSize = 28.sp, color = Ink)
                OutlinedButton(onClick = { onSample(false) }, enabled = !state.loading) { Text(t.loadSample, fontSize = 10.sp) }
            }
            OutlinedTextField(value = state.vehicle, onValueChange = onVehicle, enabled = !state.loading, modifier = Modifier.fillMaxWidth(), label = { Text(t.vehicle) }, placeholder = { Text(t.vehicleHint) }, singleLine = true)
            OutlinedTextField(value = state.mileage, onValueChange = onMileage, enabled = !state.loading, modifier = Modifier.fillMaxWidth(), label = { Text(t.mileage) }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number), singleLine = true)
            OutlinedTextField(value = state.notes, onValueChange = onNotes, enabled = !state.loading, modifier = Modifier.fillMaxWidth().height(156.dp), label = { Text(if (state.reviewEvidence) t.intakeNote else t.notes) }, placeholder = { Text(t.notesHint) }, supportingText = { Text("${state.notes.length} / 3000") })

            if (!synthetic) {
                FilterChip(
                    selected = state.reviewEvidence,
                    onClick = { onReviewEvidence(!state.reviewEvidence) },
                    enabled = !state.loading,
                    label = { Text(t.reviewEvidence) },
                )
                if (state.reviewEvidence) {
                    OutlinedButton(onClick = { onSample(true) }, enabled = !state.loading) { Text(t.loadSeatSample) }
                    OutlinedTextField(
                        value = state.technicianNote,
                        onValueChange = onTechnicianNote,
                        enabled = !state.loading,
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text(t.technicianNote) },
                        placeholder = { Text(t.technicianHint) },
                        minLines = 3,
                    )
                }
            }

            val redactionCount = intake.count + if (state.reviewEvidence) technician.count else 0
            Column(
                modifier = Modifier.fillMaxWidth().background(Color(0xFFE8F2ED), RoundedCornerShape(18.dp)).padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(9.dp),
            ) {
                Text("✓  ${t.privacy}", color = Ink, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                Text(if (redactionCount > 0) "$redactionCount ${t.identifiers}" else t.noIdentifiers, color = Ink.copy(alpha = 0.64f), fontSize = 11.sp, lineHeight = 16.sp)
                if (state.notes.isNotBlank()) {
                    PrivacyText(if (state.reviewEvidence) "${t.intakeNote}\n${intake.text}" else intake.text)
                }
                if (state.reviewEvidence && state.technicianNote.isNotBlank()) PrivacyText("${t.technicianNote}\n${technician.text.trim().take(1000)}")
            }

            Button(
                onClick = onGenerate,
                enabled = available && !state.loading && state.notes.trim().length >= 12,
                colors = ButtonDefaults.buttonColors(containerColor = Ink, contentColor = Color.White),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth().height(52.dp),
            ) {
                val action = when {
                    state.loading -> t.generating
                    !state.reviewEvidence -> t.generate
                    state.technicianNote.isBlank() -> t.checkEvidence
                    else -> t.updateReport
                }
                Text(action, fontWeight = FontWeight.Bold)
            }

            state.error?.let { Text(it, color = MaterialTheme.colorScheme.error, fontSize = 12.sp) }
            if (!available) Text(t.setupRequired, color = MaterialTheme.colorScheme.error, fontSize = 11.sp)
        }
    }
}

@Composable
private fun PrivacyText(value: String) {
    Text(value, color = Ink.copy(alpha = 0.75f), fontSize = 11.sp, lineHeight = 16.sp, modifier = Modifier.fillMaxWidth().background(Color.White.copy(alpha = 0.6f), RoundedCornerShape(12.dp)).padding(12.dp))
}

@Composable
private fun ReportCard(result: EngineResult, t: UiMessages) {
    val report = result.report
    val review = result.evidenceReview
    val waitingForEvidence = review?.technicianNote == ""
    val questions = if (waitingForEvidence) listOf(report.followUpQuestions.firstOrNull() ?: t.evidenceQuestion) else report.followUpQuestions
    Card(colors = CardDefaults.cardColors(containerColor = PaperBright), shape = RoundedCornerShape(26.dp), elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
            Box(Modifier.fillMaxWidth().height(7.dp).background(urgencyColor(report.urgency)))
            Column(modifier = Modifier.padding(horizontal = 22.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text(t.report.uppercase(), color = MaterialTheme.colorScheme.secondary, fontWeight = FontWeight.Black, fontSize = 10.sp, letterSpacing = 1.2.sp)
                Text(if (waitingForEvidence) t.evidenceNeeded else report.summary, color = Ink, fontFamily = FontFamily.Serif, fontSize = 27.sp, lineHeight = 32.sp)
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    EvidenceChip(t.source, result.source)
                    EvidenceChip(t.model, result.modelName)
                    EvidenceChip(t.urgency, t.urgencyNames[report.urgency] ?: report.urgency)
                    if (!waitingForEvidence) EvidenceChip(t.confidence, "${(report.confidence * 100).toInt()}%")
                }
                if (review != null) {
                    ReportSection(if (waitingForEvidence) t.intakeNote else t.evidenceReceived) {
                        BorderedItem(t.intakeNote, review.intake, "")
                        if (waitingForEvidence) Text(t.evidencePending, color = Ink, fontSize = 12.sp)
                        else BorderedItem(t.technicianNote, review.technicianNote, "")
                    }
                }
                if (!waitingForEvidence) {
                    ReportSection(t.observations) {
                        report.observations.forEach { observation ->
                            BorderedItem(observation.system, observation.symptom, observation.severity)
                        }
                    }
                    ReportSection(t.steps) {
                        report.inspectionSteps.forEachIndexed { index, step ->
                            BorderedItem("${index + 1}. ${step.title}", step.reason, if (step.safetyLevel == "professional_only") t.professional else t.ownerSafe)
                        }
                    }
                    if (review == null || report.suggestedServices.isNotEmpty()) {
                        ReportSection(t.services) {
                            report.suggestedServices.forEach { service ->
                                BorderedItem(service.name, service.reason, service.priority)
                            }
                        }
                    }
                }
                if (report.safetyNotices.isNotEmpty()) ReportBulletSection(t.notices, report.safetyNotices, true)
                if (questions.isNotEmpty()) ReportBulletSection(t.questions, questions, false)
                Text(t.disclaimer, color = Ink.copy(alpha = 0.58f), fontSize = 10.sp, modifier = Modifier.padding(bottom = 24.dp))
            }
        }
    }
}

@Composable
private fun EvidenceChip(label: String, value: String) {
    Column(modifier = Modifier.background(Color(0xFFF0EEE6), RoundedCornerShape(12.dp)).padding(horizontal = 12.dp, vertical = 9.dp)) {
        Text(label.uppercase(), color = Ink.copy(alpha = 0.55f), fontSize = 8.sp, fontWeight = FontWeight.Black)
        Text(value.replace('_', ' '), color = Ink, fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun ReportSection(title: String, content: @Composable () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(9.dp)) {
        Text(title, color = Ink, fontSize = 13.sp, fontWeight = FontWeight.Black)
        content()
    }
}

@Composable
private fun BorderedItem(title: String, body: String, tag: String) {
    Column(
        modifier = Modifier.fillMaxWidth().border(1.dp, Ink.copy(alpha = 0.14f), RoundedCornerShape(15.dp)).padding(15.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(title, color = Ink, fontSize = 13.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
            if (tag.isNotEmpty()) Text(tag.replace('_', ' '), color = Ink.copy(alpha = 0.62f), fontSize = 8.sp, modifier = Modifier.background(Lime.copy(alpha = 0.45f), RoundedCornerShape(50.dp)).padding(horizontal = 7.dp, vertical = 4.dp))
        }
        Text(body, color = Ink.copy(alpha = 0.65f), fontSize = 11.sp, lineHeight = 16.sp)
    }
}

@Composable
private fun ReportBulletSection(title: String, entries: List<String>, warning: Boolean) {
    ReportSection(title) {
        entries.forEach { entry ->
            Row(horizontalArrangement = Arrangement.spacedBy(9.dp)) {
                Text(if (warning) "!" else "→", color = if (warning) Coral else MaterialTheme.colorScheme.secondary, fontWeight = FontWeight.Black)
                Text(entry, color = Ink.copy(alpha = 0.72f), fontSize = 11.sp, lineHeight = 16.sp, modifier = Modifier.weight(1f))
            }
        }
    }
}

private fun urgencyColor(urgency: String): Color = when (urgency) {
    "stop_driving" -> Color(0xFFD9534F)
    "urgent" -> Coral
    "soon" -> Color(0xFFE8B65E)
    else -> Color(0xFF76B897)
}
