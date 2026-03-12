-- CreateIndex
CREATE INDEX "note_userId_delDatetime_isPinned_pinDatetime_modDatetime_idx" ON "note"("userId", "delDatetime", "isPinned", "pinDatetime", "modDatetime");

-- CreateIndex
CREATE INDEX "note_userId_isSecret_idx" ON "note"("userId", "isSecret");

-- CreateIndex
CREATE INDEX "note_isPublic_delDatetime_idx" ON "note"("isPublic", "delDatetime");

-- CreateIndex
CREATE INDEX "note_categoryNo_idx" ON "note"("categoryNo");
