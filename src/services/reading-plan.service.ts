import { Injectable } from '@angular/core';
import { Reading } from '../models/reading.model';

@Injectable({
  providedIn: 'root'
})
export class ReadingPlanService {
  private readings: Reading[] = [];
  private readingsMap = new Map<number, Reading>();

  constructor() {
    this.parseReadingData();
  }

  getReadingForDay(day: number): Reading | undefined {
    return this.readingsMap.get(day);
  }

  private parseReadingData(): void {
    const data = `Day,Period,First Reading,Second Reading,Psalm / Proverbs
1,,Genesis 1-2,,Psalm 19
2,Early World,Genesis 3-4,,Psalm 104
3,,Genesis 5-6,,Psalm 136
4,,Genesis 7-9,,Psalm 1
5,,Genesis 10-11,,Psalm 2
6,,Genesis 12-13,Job 1-2,Proverbs 1:1-7
7,Patriarchs,Genesis 14-15,Job 3-4,Proverbs 1:8-19
8,,Genesis 16-17,Job 5-6,Proverbs 1:20-33
9,,Genesis 18-19,Job 7-8,Proverbs 2:1-5
10,,Genesis 20-21,Job 9-10,Proverbs 2:6-8
11,,Genesis 22-23,Job 11-12,Proverbs 2:9-15
12,,Genesis 24,Job 13-14,Proverbs 2:16-19
13,,Genesis 25-26,Job 15-16,Proverbs 2:20-22
14,,Genesis 27-28,Job 17-18,Proverbs 3:1-4
15,,Genesis 29-30,Job 19-20,Proverbs 3:5-8
16,,Genesis 31-32,Job 21-22,Proverbs 3:9-12
17,,Genesis 33-34,Job 23-24,Proverbs 3:13-18
18,,Genesis 35-36,Job 25-26,Proverbs 3:19-24
19,,Genesis 37,Job 27-28,Proverbs 3:25-27
20,,Genesis 38,Job 29-30,Proverbs 3:28-32
21,,Genesis 39-40,Job 31-32,Proverbs 3:33-35
22,,Genesis 41-42,Job 33-34,Proverbs 4:1-9
23,,Genesis 43-44,Job 35-36,Proverbs 4:10-19
24,,Genesis 45-46,Job 37-38,Proverbs 4:20-27
25,,Genesis 47-48,Job 39-40,Psalm 16
26,,Genesis 49-50,Job 41-42,Psalm 17
27,,Exodus 1-2,Leviticus 1,Psalm 44
28,Egypt and Exodus,Exodus 3,Leviticus 2-3,Psalm 45
29,,Exodus 4-5,Leviticus 4,Psalm 46
30,,Exodus 6-7,Leviticus 5,Psalm 47
31,,Exodus 8,Leviticus 6,Psalm 48
32,,Exodus 9,Leviticus 7,Psalm 49
33,,Exodus 10-11,Leviticus 8,Psalm 50
34,,Exodus 12,Leviticus 9,Psalm 114
35,,Exodus 13-14,Leviticus 10,Psalm 53
36,,Exodus 15-16,Leviticus 11,Psalm 71
37,,Exodus 17-18,Leviticus 12,Psalm 73
38,,Exodus 19-20,Leviticus 13,Psalm 74
39,,Exodus 21,Leviticus 14,Psalm 75
40,,Exodus 22,Leviticus 15,Psalm 76
41,,Exodus 23,Leviticus 16,Psalm 77
42,,Exodus 24,Leviticus 17-18,Psalm 78
43,,Exodus 25-26,Leviticus 19,Psalm 79
44,,Exodus 27-28,Leviticus 20,Psalm 119:1-88
45,,Exodus 29,Leviticus 21,Psalm 119:89-176
46,,Exodus 30-31,Leviticus 22,Psalm 115
47,,Leviticus 23,Exodus 32,Psalm 80
48,,Leviticus 24,Exodus 33-34,Psalm 81
49,,Exodus 35-36,Leviticus 25,Psalm 82
50,,Exodus 37-38,Leviticus 26,Psalm 83
51,,Exodus 39-40,Leviticus 27,Psalm 84
52,,Numbers 1,Deuteronomy 1,Psalm 85
53,Desert Wanderings,Numbers 2,Deuteronomy 2,Psalm 87
54,Desert Wanderings,Numbers 3,Deuteronomy 3,Psalm 88
55,,Numbers 4,Deuteronomy 4,Psalm 89
56,,Numbers 5,Deuteronomy 5,Psalm 90
57,,Numbers 6,Deuteronomy 6,Psalm 91
58,,Numbers 7,Deuteronomy 7,Psalm 92
59,,Numbers 8-9,Deuteronomy 8,Psalm 93
60,,Numbers 10,Deuteronomy 9,Psalm 10
61,,Numbers 11,Deuteronomy 10,Psalm 33
62,,Numbers 12-13,Deuteronomy 11,Psalm 94
63,,Numbers 14,Deuteronomy 12,Psalm 95
64,,Numbers 15,Deuteronomy 13-14,Psalm 96
65,,Numbers 16,Deuteronomy 15-16,Psalm 97
66,,Numbers 17,Deuteronomy 17-18,Psalm 98
67,,Deuteronomy 19-20,Numbers 18,Psalm 99
68,,Numbers 19-20,Deuteronomy 21,Psalm 100
69,,Numbers 21,Deuteronomy 22,Psalm 102
70,,Numbers 22,Deuteronomy 23,Psalm 105
71,,Deuteronomy 24-25,Numbers 23,Psalm 106
72,,Numbers 24-25,Deuteronomy 26,Psalm 107
73,,Numbers 26,Deuteronomy 27,Psalm 111
74,,Numbers 27-28,Deuteronomy 28,Psalm 112
75,,Numbers 29-30,Deuteronomy 29,Psalm 113
76,,Numbers 31,Deuteronomy 30,Psalm 116
77,,Numbers 32,Deuteronomy 31,Psalm 117
78,,Numbers 33,Deuteronomy 32,Psalm 118
79,,Numbers 34,Deuteronomy 33,Psalm 120
80,,Numbers 35-36,Deuteronomy 34,Psalm 121
81,,Joshua 1-4,,Psalm 123
82,Conquest and Judges,Joshua 5-7,,Psalm 125
83,,Joshua 8-9,,Psalm 126
84,,Joshua 10-11,,Psalm 128
85,,Joshua 12-14,,Psalm 129
86,,Joshua 15-18,,Psalm 130
87,,Joshua 19-21,,Psalm 131
88,,Joshua 22-24,,Psalm 132
89,,Ruth 1,Judges 1-3,Psalm 133
90,,Judges 4-5,Ruth 2,Psalm 134
91,,Ruth 3,Judges 6-8,Psalm 135
92,,Judges 9-11,Ruth 4,Psalm 137
93,,Judges 12-15,,Psalm 146
94,,Judges 16-18,,Psalm 147
95,,Judges 19-21,,Psalm 148
96,,1 Samuel 1-2,,Psalm 149
97,,1 Samuel 3-5,,Psalm 150
98,,1 Samuel 6-8,,Psalm 86
99,,John 1-3,,Proverbs 5:1-6
100,Messianic Checkpoint,John 4-6,,Proverbs 5:7-14
101,,John 7-9,,Proverbs 5:15-23
102,,John 10-12,,Proverbs 6:1-11
103,,John 13-15,,Proverbs 6:12-19
104,,John 16-18,,Proverbs 6:20-24
105,,John 19-21,,Proverbs 6:25-35
106,,1 Samuel 9-10,,Psalm 50
107,Royal Kingdom,1 Samuel 11-12,,Psalm 55
108,,1 Samuel 13-14,,Psalm 58
109,,1 Samuel 15-16,,Psalm 61
110,,1 Samuel 17,,Psalm 12
111,,1 Samuel 18-19,,Psalm 59
112,,1 Samuel 20,,Psalm 142
113,,1 Samuel 21-22,,Psalm 52
114,,1 Samuel 23,,Psalm 54
115,,1 Samuel 24,,Psalm 57
116,,1 Samuel 25,,Psalm 63
117,,1 Samuel 26,,Psalm 56
118,,1 Samuel 27-28,,Psalm 34
119,,1 Samuel 29-31,,Psalm 18
120,,2 Samuel 1,1 Chronicles 1,Psalm 13
121,,2 Samuel 2,1 Chronicles 2,Psalm 24
122,,2 Samuel 3,1 Chronicles 3-4,Psalm 25
123,,2 Samuel 4,1 Chronicles 5-6,Psalm 26
124,,2 Samuel 5,1 Chronicles 7-8,Psalm 27
125,,2 Samuel 6-7,1 Chronicles 9,Psalm 89
126,,2 Samuel 8,1 Chronicles 10-11,Psalm 60
127,,2 Samuel 9,1 Chronicles 12,Psalm 28
128,,2 Samuel 10,1 Chronicles 13,Psalm 31
129,,2 Samuel 11,1 Chronicles 14-15,Psalm 32
130,,2 Samuel 12,1 Chronicles 16,Psalm 51
131,,2 Samuel 13,1 Chronicles 17,Psalm 35
132,,2 Samuel 14,1 Chronicles 18,Psalm 14
133,,2 Samuel 15,1 Chronicles 19-20,Psalm 3
134,,2 Samuel 16,1 Chronicles 21,Psalm 15
135,,2 Samuel 17,1 Chronicles 22,Psalm 36
136,,2 Samuel 18,1 Chronicles 23,Psalm 37
137,,2 Samuel 19,1 Chronicles 24,Psalm 38
138,,2 Samuel 20,1 Chronicles 25,Psalm 39
139,,2 Samuel 21,1 Chronicles 26,Psalm 40
140,,2 Samuel 22,1 Chronicles 27,Psalm 41
141,,2 Samuel 23,1 Chronicles 28,Psalm 42
142,,2 Samuel 24,1 Chronicles 29,Psalm 30
143,,1 Kings 1,2 Chronicles 1,Psalm 43
144,,1 Kings 2,2 Chronicles 2-3,Psalm 62
145,,1 Kings 3,2 Chronicles 4-5,Psalm 64
146,,1 Kings 4,2 Chronicles 6,Psalm 65
147,,1 Kings 5,2 Chronicles 7-8,Psalm 66
148,,1 Kings 6,2 Chronicles 9,Psalm 4
149,,1 Kings 7,Ecclesiastes 1-3,Psalm 5
150,,1 Kings 8,Ecclesiastes 4-6,Psalm 6
151,,1 Kings 9,Ecclesiastes 5-6,Psalm 7
152,,1 Kings 10,Ecclesiastes 7-9,Psalm 8
153,,1 Kings 11,Ecclesiastes 10-12,Psalm 9
154,,Mark 1-2,,Psalm 11
155,Messianic Checkpoint,Mark 3-4,,Psalm 20
156,,Mark 5-6,,Psalm 21
157,,Mark 7-8,,Psalm 23
158,,Mark 9-10,,Psalm 29
159,,Mark 11-12,,Psalm 67
160,,Mark 13-14,,Psalm 68
161,,Mark 15-16,,Psalm 22
162,,1 Kings 12,2 Chronicles 10-11,Song of Solomon 1
163,Divided Kingdom,1 Kings 13,2 Chronicles 12-13,Song of Solomon 2
164,Divided Kingdom,1 Kings 14,2 Chronicles 14-15,Song of Solomon 3
165,Divided Kingdom,1 Kings 15-16,2 Chronicles 16-17,Song of Solomon 4
166,Divided Kingdom,1 Kings 17-18,2 Chronicles 18-19,Song of Solomon 5
167,Divided Kingdom,1 Kings 19-20,2 Chronicles 20,Song of Solomon 6
168,Divided Kingdom,1 Kings 21,2 Chronicles 21-22,Song of Solomon 7
169,Divided Kingdom,1 Kings 22,2 Chronicles 23,Song of Solomon 8
170,Exile,2 Kings 1,2 Chronicles 24,Psalm 69
171,Exile,2 Kings 2,2 Chronicles 25,Psalm 70
172,Exile,2 Kings 3,2 Chronicles 26-27,Psalm 72
173,Exile,2 Kings 4,2 Chronicles 28,Psalm 127
174,Exile,2 Kings 5,Hosea 1-3,Psalm 101
175,Exile,2 Kings 6-7,Hosea 4-7,Psalm 103
176,Exile,2 Kings 8,Hosea 8-10,Psalm 108
177,Exile,2 Kings 9,Hosea 11-14,Psalm 109
178,Exile,2 Kings 10,Amos 1-3,Psalm 110
179,Exile,2 Kings 11-12,Amos 4-6,Psalm 122
180,Exile,2 Kings 13-14,Amos 7-9,Psalm 124
181,Exile,2 Kings 15,Jonah 1-4,Psalm 138
182,Exile,2 Kings 16,Micah 1-4,Psalm 139
183,Exile,2 Kings 17,Micah 5-7,Psalm 140
184,Exile,2 Kings 18,2 Chronicles 29,Psalm 141
185,,2 Kings 19,2 Chronicles 30,Psalm 143
186,,2 Kings 20,2 Chronicles 31,Psalm 144
187,,2 Kings 21,2 Chronicles 32,Psalm 145
188,,2 Kings 22,2 Chronicles 33,Proverbs 7
189,,2 Kings 23,2 Chronicles 34,Proverbs 8:1-21
190,,2 Kings 24,2 Chronicles 35,Proverbs 8:22-36
191,,2 Kings 25,2 Chronicles 36,Proverbs 9:1-6
192,,Isaiah 1-2,Tobit 1-2,Proverbs 9:7-12
193,,Isaiah 3-4,Tobit 3-4,Proverbs 9:13-18
194,,Isaiah 5-6,Tobit 5-6,Proverbs 10:1-4
195,,Isaiah 7-8,Tobit 7-9,Proverbs 10:5-8
196,,Isaiah 9-10,Tobit 10-12,Proverbs 10:9-12
197,,Isaiah 11-13,Tobit 13-14,Proverbs 10:13-16
198,,Isaiah 14-15,Joel 1-2,Proverbs 10:17-20
199,,Isaiah 16-17,Joel 3,Proverbs 10:21-24
200,,Isaiah 18-20,Nahum 1-2,Proverbs 10:25-28
201,,Isaiah 21-22,Nahum 3,Proverbs 10:29-32
202,,Isaiah 23-24,Habakkuk 1-2,Proverbs 11:1-4
203,,Isaiah 25-27,Habakkuk 3,Proverbs 11:5-8
204,,Isaiah 28-29,Zephaniah 1-2,Proverbs 11:9-12
205,,Isaiah 30-31,Zephaniah 3,Proverbs 11:13-16
206,,Isaiah 32-33,Baruch 1-2,Proverbs 11:17-20
207,,Isaiah 34-36,Baruch 3-4,Proverbs 11:21-24
208,,Isaiah 37-38,Baruch 5-6,Proverbs 11:25-28
209,,Isaiah 39-40,Ezekiel 1,Proverbs 11:29-31
210,,Isaiah 41-42,Ezekiel 2-3,Proverbs 12:1-4
211,,Isaiah 43-44,Ezekiel 4-5,Proverbs 12:5-8
212,,Isaiah 45-46,Ezekiel 6-7,Proverbs 12:9-12
213,,Isaiah 47-48,Ezekiel 8-9,Proverbs 12:13-16
214,,Isaiah 49-50,Ezekiel 10-11,Proverbs 12:17-20
215,,Isaiah 51-52,Ezekiel 12-13,Proverbs 12:21-24
216,,Isaiah 53-54,Ezekiel 14-15,Proverbs 12:25-28
217,,Isaiah 55-56,Ezekiel 16,Proverbs 13:1-4
218,,Isaiah 57-58,Ezekiel 17-18,Proverbs 13:5-8
219,,Isaiah 59-60,Ezekiel 19,Proverbs 13:9-12
220,,Isaiah 61-62,Ezekiel 20,Proverbs 13:13-16
221,,Isaiah 63-64,Ezekiel 21-22,Proverbs 13:17-20
222,,Isaiah 65,Ezekiel 23-24,Proverbs 13:21-25
223,,Isaiah 66,Ezekiel 25-26,Proverbs 14:1-4
224,,Jeremiah 1,Ezekiel 27,Proverbs 14:5-8
225,,Jeremiah 2,Ezekiel 28,Proverbs 14:9-12
226,,Jeremiah 3,Ezekiel 29-30,Proverbs 14:13-16
227,,Jeremiah 4,Ezekiel 31-32,Proverbs 14:17-20
228,,Jeremiah 5,Ezekiel 33,Proverbs 14:21-24
229,,Jeremiah 6,Ezekiel 34-35,Proverbs 14:25-28
230,,Jeremiah 7,Ezekiel 36,Proverbs 14:29-32
231,,Jeremiah 8,Ezekiel 37-38,Proverbs 14:33-35
232,,Jeremiah 9,Ezekiel 39,Proverbs 15:1-4
233,,Jeremiah 10-11,Ezekiel 40,Proverbs 15:5-8
234,,Jeremiah 12-13,Ezekiel 41-42,Proverbs 15:9-12
235,,Jeremiah 14-15,Ezekiel 43-44,Proverbs 15:13-16
236,,Jeremiah 16-17,Ezekiel 45-46,Proverbs 15:17-20
237,,Jeremiah 18-19,Ezekiel 47-48,Proverbs 15:21-24
238,,Jeremiah 20-21,Daniel 1-2,Proverbs 15:25-28
239,,Jeremiah 22,Daniel 3,Proverbs 15:29-33
240,,Jeremiah 23,Daniel 4-5,Proverbs 16:1-4
241,,Jeremiah 24-25,Daniel 6-7,Proverbs 16:5-8
242,,Jeremiah 26-27,Daniel 8-9,Proverbs 16:9-12
243,,Jeremiah 28-29,Daniel 10-11,Proverbs 16:13-16
244,,Jeremiah 30,Daniel 12-13,Proverbs 16:17-20
245,,Jeremiah 31,Daniel 14,Proverbs 16:21-24
246,,Jeremiah 32,Judith 1-2,Proverbs 16:25-28
247,,Jeremiah 33-34,Judith 3-5,Proverbs 16:29-33
248,,Jeremiah 35-36,Judith 6-7,Proverbs 17:1-4
249,,Jeremiah 37-38,Judith 8-9,Proverbs 17:5-8
250,,Jeremiah 39-40,Judith 10-11,Proverbs 17:9-12
251,,Jeremiah 41-42,Judith 12-14,Proverbs 17:13-16
252,,Jeremiah 43-44,Judith 15-16,Proverbs 17:17-20
253,,Jeremiah 45-46,Lamentations 1,Proverbs 17:21-24
254,,Jeremiah 47-48,Lamentations 2,Proverbs 18:1-4
255,,Jeremiah 49-50,Lamentations 3,Proverbs 18:5-8
256,,Jeremiah 51,Lamentations 4-5,Proverbs 18:9-12
257,,Jeremiah 52,Obadiah 1,Proverbs 18:13-16
258,,Matthew 1-4,,Proverbs 18:17-20
259,Messianic Checkpoint,Matthew 5-7,,Proverbs 18:21-24
260,,Matthew 8-10,,Proverbs 19:1-4
261,,Matthew 11-13,,Proverbs 19:5-8
262,,Matthew 14-17,,Proverbs 19:9-12
263,,Matthew 18-21,,Proverbs 19:13-16
264,,Matthew 22-24,,Proverbs 19:17-20
265,,Matthew 25-26,,Proverbs 19:21-24
266,,Matthew 27-28,,Proverbs 19:25-29
267,,Ezra 1-2,Haggai 1-2,Proverbs 20:1-3
268,Return,Ezra 3-4,Zechariah 1-3,Proverbs 20:4-7
269,,Ezra 5-6,Zechariah 4-6,Proverbs 20:8-11
270,,Ezra 7-8,Zechariah 7-8,Proverbs 20:12-15
271,,Ezra 9-10,Zechariah 9-11,Proverbs 20:16-19
272,,Nehemiah 1-2,Zechariah 12-13,Proverbs 20:20-22
273,,Nehemiah 3,Zechariah 14,Proverbs 20:23-26
274,,Nehemiah 4-5,Esther 1-2,Proverbs 20:27-30
275,,Nehemiah 6-7,"Esther 3, 13",Proverbs 21:1-4
276,,Nehemiah 8,"Esther 4, 14",Proverbs 21:5-8
277,,Nehemiah 9,"Esther 15, 6-7",Proverbs 21:9-12
278,,Nehemiah 10,"Esther 8, 16",Proverbs 21:13-16
279,,Nehemiah 11,Esther 9-11,Proverbs 21:17-20
280,,Nehemiah 12,Esther 10-12,Proverbs 21:21-24
281,,Nehemiah 13,Malachi 1-4,Proverbs 21:25-28
282,Maccabean Revolt,1 Maccabees 1,Sirach 1-3,Proverbs 21:29-31
283,Maccabean Revolt,1 Maccabees 2,Sirach 4-6,Proverbs 22:1-4
284,Maccabean Revolt,1 Maccabees 3,Sirach 7-9,Proverbs 22:5-8
285,Maccabean Revolt,1 Maccabees 4,Sirach 10-12,Proverbs 22:9-12
286,Maccabean Revolt,1 Maccabees 5,Sirach 13-15,Proverbs 22:13-16
287,Maccabean Revolt,1 Maccabees 6,Sirach 16-18,Proverbs 22:17-21
288,Maccabean Revolt,1 Maccabees 7,Sirach 19-21,Proverbs 22:22-25
289,Maccabean Revolt,1 Maccabees 8,Sirach 22-23,Proverbs 22:26-29
290,Maccabean Revolt,1 Maccabees 9,Sirach 24-25,Proverbs 23:1-4
291,Maccabean Revolt,1 Maccabees 10,Sirach 26-27,Proverbs 23:5-8
292,Maccabean Revolt,1 Maccabees 11,Sirach 28-29,Proverbs 23:9-12
293,Maccabean Revolt,1 Maccabees 12,Sirach 30-31,Proverbs 23:13-16
294,Maccabean Revolt,1 Maccabees 13,Sirach 32-33,Proverbs 23:17-21
295,Maccabean Revolt,1 Maccabees 14,Sirach 34-35,Proverbs 23:22-25
296,Maccabean Revolt,1 Maccabees 15,Sirach 36-37,Proverbs 23:26-28
297,Maccabean Revolt,1 Maccabees 16,Sirach 38-39,Proverbs 23:29-35
298,Maccabean Revolt,2 Maccabees 1,Sirach 40-41,Proverbs 24:1-7
299,Maccabean Revolt,2 Maccabees 2,Sirach 42-44,Proverbs 24:8-9
300,Maccabean Revolt,2 Maccabees 3,Sirach 45-46,Proverbs 24:10-12
301,Maccabean Revolt,2 Maccabees 4,Sirach 47-49,Proverbs 24:13-16
302,Maccabean Revolt,2 Maccabees 5,Sirach 50-51,Proverbs 24:17-20
303,Maccabean Revolt,2 Maccabees 6,Wisdom 1-2,Proverbs 24:21-26
304,Maccabean Revolt,2 Maccabees 7,Wisdom 3-4,Proverbs 24:27-29
305,Maccabean Revolt,2 Maccabees 8,Wisdom 5-6,Proverbs 24:30-34
306,Maccabean Revolt,2 Maccabees 9,Wisdom 7-8,Proverbs 25:1-3
307,Maccabean Revolt,2 Maccabees 10,Wisdom 9-10,Proverbs 25:4-7
308,Maccabean Revolt,2 Maccabees 11,Wisdom 11-12,Proverbs 25:8-10
309,Maccabean Revolt,2 Maccabees 12,Wisdom 13-14,Proverbs 25:11-14
310,Maccabean Revolt,2 Maccabees 13,Wisdom 15-16,Proverbs 25:15-17
311,Maccabean Revolt,2 Maccabees 14,Wisdom 17-18,Proverbs 25:18-20
312,Maccabean Revolt,2 Maccabees 15,Wisdom 19,Proverbs 25:21-23
313,Messianic Fulfillment,Luke 1-2,,Proverbs 25:24-26
314,Messianic Fulfillment,Luke 3-5,,Proverbs 25:27-28
315,,Luke 6-8,,Proverbs 26:1-3
316,,Luke 9-10,,Proverbs 26:4-6
317,,Luke 11-12,,Proverbs 26:7-9
318,,Luke 13-16,,Proverbs 26:10-12
319,,Luke 17-19,,Proverbs 26:13-16
320,,Luke 20-22:38,,Proverbs 26:17-19
321,,Luke 22:39-24,,Proverbs 26:20-23
322,The Church,Acts 1,Romans 1,Proverbs 26:24-26
323,The Church,Acts 2,Romans 2-3,Proverbs 26:27-28
324,,Acts 3,Romans 4-5,Proverbs 27:1-3
325,,Acts 4,Romans 6-7,Proverbs 27:4-6
326,,Acts 5,Romans 8,Proverbs 27:7-9
327,,Acts 6,Romans 9-10,Proverbs 27:10-12
328,,Acts 7,Romans 11-12,Proverbs 27:13-14
329,,Acts 8,Romans 13-14,Proverbs 27:15-17
330,,Acts 9,Romans 15-16,Proverbs 27:18-20
331,,Acts 10,1 Corinthians 1-2,Proverbs 27:21-22
332,,Acts 11,1 Corinthians 3-4,Proverbs 27:23-27
333,,Acts 12,1 Corinthians 5-6,Proverbs 28:1-3
334,,Acts 13,1 Corinthians 7-8,Proverbs 28:4-6
335,,Acts 14,1 Corinthians 9-10,Proverbs 28:7-9
336,,Acts 15,1 Corinthians 11-12,Proverbs 28:10-12
337,,Acts 16,1 Corinthians 13-14,Proverbs 28:13-15
338,,Acts 17,1 Corinthians 15,Proverbs 28:16-18
339,,Acts 18,1 Corinthians 16,Proverbs 28:19-21
340,,Acts 19,2 Corinthians 1-2,Proverbs 28:22-24
341,,Acts 20,2 Corinthians 3-5,Proverbs 28:25-28
342,,Acts 21,2 Corinthians 6-8,Proverbs 29:1-4
343,,Acts 22,2 Corinthians 9-11,Proverbs 29:5-7
344,,Acts 23,2 Corinthians 12-13,Proverbs 29:8-11
345,,Acts 24,Galatians 1-3,Proverbs 29:12-14
346,,Acts 25,Galatians 4-6,Proverbs 29:15-17
347,,Acts 26,Ephesians 1-3,Proverbs 29:18-21
348,,Acts 27,Ephesians 4-6,Proverbs 29:22-24
349,,Acts 28,Philippians 1-2,Proverbs 29:25-27
350,,James 1-2,Philippians 3-4,Proverbs 30:1-6
351,,James 3-5,Colossians 1-2,Proverbs 30:7-9
352,,1 Peter 1-2,Colossians 3-4,Proverbs 30:10-14
353,,1 Peter 3-5,1 Thessalonians 1-3,Proverbs 30:15-16
354,,2 Peter 1-3,1 Thessalonians 4-5,Proverbs 30:17-19
355,,1 John 1-3,2 Thessalonians 1-3,Proverbs 30:20-23
356,,1 John 4-5,1 Timothy 1-3,Proverbs 30:24-28
357,,2 John and 3 John,1 Timothy 4-6,Proverbs 30:29-33
358,,Jude,2 Timothy 1-2,Proverbs 31:1-7
359,,Revelation 1-3,2 Timothy 3-4,Proverbs 31:8-9
360,,Revelation 4-7,Titus 1-3,Proverbs 31:10-15
361,,Revelation 8-11,Philemon,Proverbs 31:16-18
362,,Revelation 12-14,Hebrews 1-4,Proverbs 31:19-22
363,,Revelation 15-17,Hebrews 5-8,Proverbs 31:23-25
364,,Revelation 18-20,Hebrews 9-10,Proverbs 31:26-29
365,,Revelation 21-22,Hebrews 11-13,Proverbs 31:30-31`;
    
    const lines = data.split('\n').slice(1); // remove header
    this.readings = lines.map(line => {
      const columns = line.split(',');
      return {
        day: parseInt(columns[0], 10),
        period: columns[1] || undefined,
        firstReading: columns[2] || undefined,
        secondReading: columns[3] || undefined,
        psalmProverbs: columns[4] || undefined,
      };
    });

    this.readings.forEach(reading => {
      this.readingsMap.set(reading.day, reading);
    });
  }
}
